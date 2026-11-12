<#
=====================================================================
Jai Krishna Ram 100-Acre Luxury Farmhouse & Sanctuary
Zero-Dependency Native Windows HTTP REST Backend Server (PowerShell & .NET)
Runs instantly on Windows with 0 npm/python installs required!
Listening on: http://localhost:5000/
=====================================================================
#>

$port = 5000
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=======================================================" -ForegroundColor DarkGreen
    Write-Host "🏰 JAI KRISHNA RAM FARMHOUSE BACKEND SERVER (LIVE)" -ForegroundColor Yellow
    Write-Host "🚀 Listening on: $prefix" -ForegroundColor Cyan
    Write-Host "📍 Estate: 100-Acre Sanctuary, HITEC City, Hyderabad" -ForegroundColor Green
    Write-Host "✨ Press Ctrl+C in this terminal to stop the server" -ForegroundColor Gray
    Write-Host "=======================================================" -ForegroundColor DarkGreen
} catch {
    Write-Host "Failed to start listener: $_" -ForegroundColor Red
    exit 1
}

$inMemoryBookings = @{}

function Send-JsonResponse($response, $statusCode, $obj) {
    $json = $obj | ConvertTo-Json -Depth 6
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $response.AddHeader("Access-Control-Allow-Origin", "*")
    $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    $response.ContentLength64 = $buffer.Length
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
    $response.OutputStream.Close()
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $urlPath = $request.Url.AbsolutePath
        $method = $request.HttpMethod

        Write-Host "[$method] $urlPath" -ForegroundColor DarkCyan

        # Handle CORS Preflight OPTIONS
        if ($method -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
            $response.OutputStream.Close()
            continue
        }

        # 1. Health
        if ($urlPath -eq "/api/v1/health") {
            Send-JsonResponse $response 200 @{
                status = "HEALTHY"
                service = "Jai Krishna Ram Farmhouse Backend (Native Windows Engine)"
                estate = "100-Acre Private Sanctuary in Central Hyderabad (Near HITEC City)"
                port = $port
                timestamp = (Get-Date).ToString("o")
            }
            continue
        }

        # 2. Resorts Catalog
        if ($urlPath -eq "/api/v1/resorts") {
            $resorts = @(
                @{
                    id = "resort-jkr-100"
                    name = "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary"
                    tagline = "Exclusive 100-Acre Private Luxury Farmhouse & Agritourism Sanctuary"
                    slug = "jaikrishnaram-farmhouse-hyderabad"
                    location_area = "HITEC City Corridor / Madhapur"
                    city = "Hyderabad"
                    distance_from_hitec_city = "12 - 15 Mins"
                    total_acreage = 100
                    base_weekend_price = 500000
                    mmt_rating = 4.95
                    review_count = 1420
                    star_category = 5
                    usps = @(
                        "100 Acres Private Exclusive Buyout (Only 1 group per weekend)",
                        "50-Acre Buffalo Sanctuary with 500 Buffalos & Organic A2 Dairy Tasting",
                        "Private Heated Swimming Pool & Natural Rock Waterfalls",
                        "25+ Acres Blooming Flower Meadows",
                        "24/7 Armed Security & Concierge Service"
                    )
                },
                @{
                    id = "resort-golkonda-hyd"
                    name = "The Golkonda Resorts & Spa"
                    location_area = "Gandipet / Osman Sagar"
                    city = "Hyderabad"
                    base_weekend_price = 24000
                    mmt_rating = 4.30
                    total_acreage = 13
                },
                @{
                    id = "resort-pragati-hyd"
                    name = "Pragati Green Resorts"
                    location_area = "Chilkur / Shankarpally"
                    city = "Hyderabad"
                    base_weekend_price = 18500
                    mmt_rating = 4.10
                    total_acreage = 85
                }
            )
            Send-JsonResponse $response 200 $resorts
            continue
        }

        # 3. Availability Calendar
        if ($urlPath -eq "/api/v1/availability") {
            $today = Get-Date
            $slots = @()
            for ($i = 0; $i -lt 8; $i++) {
                $daysAhead = (6 - [int]$today.DayOfWeek + 7) % 7 + ($i * 7)
                if ($daysAhead -eq 0) { $daysAhead = 7 }
                $sat = $today.AddDays($daysAhead)
                $sun = $sat.AddDays(1)
                $isAvail = ($i -ne 1) # mock 1 slot already reserved

                $slots += @{
                    weekend_id = "WKD-" + $sat.ToString("yyyyMMdd")
                    saturday_checkin = $sat.ToString("yyyy-MM-dd")
                    sunday_checkout = $sun.ToString("yyyy-MM-dd")
                    label = $sat.ToString("MMM dd") + " - " + $sun.ToString("MMM dd, yyyy")
                    is_available = $isAvail
                    status = if ($isAvail) { "Available for Exclusive Lease" } else { "Reserved / Leased" }
                    price = 500000
                }
            }
            Send-JsonResponse $response 200 @{
                resort_name = "Jai Krishna Ram 100-Acre Sanctuary"
                policy = "Strictly limited to 1 exclusive group per weekend (Sat 10:00 AM - Sun 06:00 PM)"
                slots = $slots
            }
            continue
        }

        # 4. Price Quotation Engine (POST /api/v1/pricing/quote)
        if ($urlPath -eq "/api/v1/pricing/quote" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $reader.Close()
            $payload = $body | ConvertFrom-Json

            $basePrice = 500000
            $addonsTotal = 0
            if ($payload.addons -or $payload.selected_addon_ids) {
                $chosen = if ($payload.addons) { $payload.addons } else { $payload.selected_addon_ids }
                foreach ($a in $chosen) {
                    if ($a -match "catering") { $addonsTotal += 75000 }
                    if ($a -match "drone") { $addonsTotal += 35000 }
                    if ($a -match "music") { $addonsTotal += 40000 }
                    if ($a -match "golf") { $addonsTotal += 20000 }
                }
            }

            $subtotal = $basePrice + $addonsTotal
            $discount = 0
            $couponTitle = $null

            $couponCode = if ($payload.couponCode) { $payload.couponCode } else { $payload.coupon_code }
            if ($couponCode -and $couponCode.ToUpper() -eq "MMTHYD2026") {
                $discount = [Math]::Min(($subtotal * 0.10), 50000)
                $couponTitle = "MakeMyTrip Hyderabad 10% Discount"
            } elseif ($couponCode -and $couponCode.ToUpper() -eq "FARMHOUSEVIP") {
                $discount = 25000
                $couponTitle = "VIP Sanctuary Flat ₹25,000 Off"
            }

            $taxable = [Math]::Max(0, ($subtotal - $discount))
            $cgst = $taxable * 0.09
            $sgst = $taxable * 0.09
            $taxes = $cgst + $sgst
            $securityDeposit = 50000
            $grandTotal = $taxable + $taxes + $securityDeposit

            Send-JsonResponse $response 200 @{
                success = $true
                resort_name = "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary"
                base_amount = $basePrice
                addons_amount = $addonsTotal
                discount_amount = $discount
                coupon_applied = $couponTitle
                taxable_amount = $taxable
                cgst_amount = $cgst
                sgst_amount = $sgst
                taxes_amount = $taxes
                security_deposit = $securityDeposit
                grand_total = $grandTotal
                currency = "INR"
                formatted_total = "₹" + $grandTotal.ToString("N0")
                breakdown_text = "Base: ₹5,00,000 + Add-ons: ₹$addonsTotal - Disc: ₹$discount + 18% GST: ₹$taxes + Deposit: ₹50,000"
            }
            continue
        }

        # 5. Bookings Creation (POST /api/v1/bookings)
        if ($urlPath -eq "/api/v1/bookings" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $reader.Close()
            $payload = $body | ConvertFrom-Json

            $refId = "JKR-HYD-2026-" + (-join ((65..90) + (48..57) | Get-Random -Count 6 | ForEach-Object { [char]$_ }))
            $guestName = if ($payload.guest_name) { $payload.guest_name } else { $payload.guestName }
            if (-not $guestName) { $guestName = "VIP Guest" }
            $guestPhone = if ($payload.guest_phone) { $payload.guest_phone } else { $payload.guestPhone }
            $checkIn = if ($payload.check_in_date) { $payload.check_in_date } else { $payload.checkInDate }

            $bookingObj = @{
                booking_reference = $refId
                status = "CONFIRMED"
                resort_name = "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary"
                guest_name = $guestName
                guest_phone = $guestPhone
                check_in_date = $checkIn
                check_in_time = "Saturday 10:00 AM"
                check_out_time = "Sunday 06:00 PM"
                guest_count = 15
                grand_total = 640000
                whatsapp_concierge_url = "https://wa.me/919876543210?text=Hello%20Jai%20Krishna%20Ram%20Concierge!%20Booking%20Ref:%20$refId"
                voucher_qr_payload = "VALID-JKR-ESTATE-LEASE:$refId:$guestName:$checkIn"
                created_at = (Get-Date).ToString("o")
            }

            $inMemoryBookings[$refId] = $bookingObj
            Send-JsonResponse $response 201 $bookingObj
            continue
        }

        # 6. Reviews
        if ($urlPath -eq "/api/v1/reviews") {
            $reviews = @(
                @{
                    id = "rev-1"
                    guest_name = "Siddharth Rao"
                    guest_title = "Vice President, Enterprise Cloud (HITEC City Tech Major)"
                    rating_overall = 5.0
                    rating_cleanliness = 5.0
                    rating_hospitality = 5.0
                    rating_food = 4.9
                    rating_location = 5.0
                    rating_value = 4.9
                    review_title = "Unmatched 100-Acre Sanctuary 15 Mins from Cyber Towers"
                    review_text = "We leased the HITEC 100 estate for our annual leadership offsite of 40 directors. Having 100 acres completely to ourselves 15 minutes from Cyber Towers was unreal. The swimming pool, the waterfall sound, and the buffalo safari tour blew everyone away. Worth every rupee of the ₹5 Lakhs fee!"
                    avatar_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    is_verified_stay = $true
                },
                @{
                    id = "rev-2"
                    guest_name = "Ananya & Rohan Kulkarni"
                    guest_title = "Pre-Wedding Destination Hosts (Banjara Hills)"
                    rating_overall = 5.0
                    review_title = "Dream Destination for Pre-Wedding & 4K Drone Shoot"
                    review_text = "We shot our pre-wedding cinematic video here. The combination of the modern luxury mansion with the rock waterfall and 25 acres of blooming flowers gave us shots that look like Tuscany and Bali combined! Our guests loved the Saturday night pool bonfire."
                    avatar_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    is_verified_stay = $true
                }
            )
            Send-JsonResponse $response 200 $reviews
            continue
        }

        # 7. AI Concierge Chatbot (POST /api/v1/concierge/chat)
        if ($urlPath -eq "/api/v1/concierge/chat" -and $method -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $reader.Close()
            $payload = $body | ConvertFrom-Json
            $msg = if ($payload.message) { $payload.message.ToLower() } else { "" }

            $reply = "Hello! I am the AI Concierge for Jai Krishna Ram Farmhouse. The 100-acre estate features 500 buffalos across 50 acres, cascading waterfalls, private pool, and weekend buyout for ₹5,00,000. How can I help you today?"
            if ($msg -match "buffalo|dairy|milk|500") {
                $reply = "🐂 The 50-Acre Buffalo Sanctuary features 500 prize Murrah and Jafrabadi buffalos, automated aeration mist cooling sheds, natural bathing lake, 10 acres of fresh green fodder, and farm-to-table organic dairy tasting!"
            } elseif ($msg -match "price|cost|lease|500000|5 lakh") {
                $reply = "💎 Weekend Exclusive Lease is ₹5,00,000 (Saturday 10:00 AM check-in to Sunday 06:00 PM check-out). Strictly 1 private group per weekend for complete 100-acre privacy!"
            } elseif ($msg -match "location|distance|hitec") {
                $reply = "📍 Situated in Central Hyderabad near HITEC City, just 12–15 minutes from Cyber Towers and 35 mins from Rajiv Gandhi International Airport via ORR."
            }

            Send-JsonResponse $response 200 @{
                query = $msg
                reply = $reply
                concierge_phone = "+91 98765 43210"
                whatsapp_url = "https://wa.me/919876543210"
            }
            continue
        }

        # Default 404
        Send-JsonResponse $response 404 @{ error = "Route not found"; path = $urlPath }
    } catch {
        Write-Host "Error handling request: $_" -ForegroundColor Red
    }
}

