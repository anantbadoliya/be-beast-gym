$port = 8000
$root = Get-Location

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Be Beast Gym AI Studio Server listening at http://localhost:$port/"
} catch {
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
    Write-Host "Be Beast Gym AI Studio Server listening at http://localhost:$port/"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".json" = "application/json"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers for AI Studio embedding
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }
        
        $urlPath = $request.Url.LocalPath

        # AI Studio Server-Side Gemini API Endpoints Simulation
        if ($urlPath -eq "/api/chat" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyJson = $reader.ReadToEnd()
            $reader.Close()

            $resObj = @{
                text = "🤖 [AI Studio Gemini API]: Welcome to Phenoix Fitness & Be Beast Gym in Byculla East, Mumbai! We offer 24/7 AI video personal training, metabolic diet calculators, and VIP masterclasses. How can I assist your transformation today?"
                source = "gemini-3.6-flash"
                aiStudioStatus = "active"
            } | ConvertTo-Json

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json"
            $response.StatusCode = 200
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }

        if ($urlPath -eq "/api/trainer" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyJson = $reader.ReadToEnd()
            $reader.Close()

            $resObj = @{
                text = "💪 [Coach Kabir - AI Studio Stream]: Exceptional form! Keep your heels grounded, brace your core tight, and explode upward."
                videoAction = "squat"
                source = "gemini-3.6-flash"
                aiStudioStatus = "active"
            } | ConvertTo-Json

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json"
            $response.StatusCode = 200
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }

        if ($urlPath -eq "/api/diet-plan" -and $request.HttpMethod -eq "POST") {
            $resObj = @{
                breakfast = "3 Whole Egg Whites / Paneer Bhurji + 2 Oats Roti + 1 Scoop Whey Protein Shake (450 kcal | 35g Protein)"
                lunch = "180g Grilled Chicken Breast / Tofu Tikka + 1 Cup Brown Rice + Sambar/Dal & Cucumber Salad (600 kcal | 42g Protein)"
                dinner = "150g Pan-Seared Fish / Baked Tofu + 2 Missi Rotis + 100g Low-fat Curd (480 kcal | 30g Protein)"
                snacks = "1 Banana + 15g Almonds + Black Coffee (280 kcal | 25g Protein)"
                supplements = "Multivitamin, Omega-3 Fish Oil, Creatine Monohydrate (5g)"
                hydration = "3.5 to 4.0 Liters daily"
                calories = 2200
                macros = @{ protein = 160; carbs = 220; fat = 65 }
                source = "gemini-3.6-flash"
                aiStudioStatus = "active"
            } | ConvertTo-Json -Depth 5

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($resObj)
            $response.ContentType = "application/json"
            $response.StatusCode = 200
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }
        
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        $relativeFile = $urlPath.TrimStart('/').Replace('/', '\')
        $filePath = [System.IO.Path]::Combine($root, $relativeFile)
        
        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # ignore context errors and continue listener loop
    }
}
