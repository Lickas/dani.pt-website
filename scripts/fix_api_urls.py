import sys
import os

files = [
    "/app/frontend/src/pages/admin/AdminDashboard.jsx",
    "/app/frontend/src/pages/admin/AdminVehicles.jsx",
    "/app/frontend/src/pages/admin/AdminMessages.jsx",
    "/app/frontend/src/pages/admin/AdminCampaignDetail.jsx",
    "/app/frontend/src/pages/admin/AdminCampaignForm.jsx",
    "/app/frontend/src/pages/admin/AdminSettings.jsx",
    "/app/frontend/src/pages/admin/AdminCampaigns.jsx",
    "/app/frontend/src/pages/admin/AdminVehicleForm.jsx"
]

search = "const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;"
replace = "const BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || '';\nconst API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';"

for f in files:
    try:
        with open(f, 'r') as file:
            content = file.read()
        
        if search in content:
            new_content = content.replace(search, replace)
            with open(f, 'w') as file:
                file.write(new_content)
            print(f"Updated {f}")
        else:
            print(f"Skipped {f} (pattern not found)")
    except Exception as e:
        print(f"Error processing {f}: {e}")
