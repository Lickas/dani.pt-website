import requests
import sys
from datetime import datetime
import json

class dANISupabaseAPITester:
    def __init__(self, base_url="https://site-renovacao.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success, response

    def test_admin_login(self, email, password):
        """Test admin login with Supabase Auth"""
        success, response = self.run_test(
            "Admin Login (Supabase)",
            "POST",
            "admin/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_get_vehicles(self):
        """Test getting all vehicles"""
        success, response = self.run_test(
            "Get All Vehicles",
            "GET",
            "vehicles",
            200
        )
        return success, response

    def test_get_vehicles_by_brand(self, brand="BMW"):
        """Test filtering vehicles by brand"""
        success, response = self.run_test(
            f"Get Vehicles by Brand ({brand})",
            "GET",
            f"vehicles?brand={brand}",
            200
        )
        return success, response

    def test_get_vehicle_by_id(self, vehicle_id):
        """Test getting specific vehicle"""
        success, response = self.run_test(
            f"Get Vehicle {vehicle_id}",
            "GET",
            f"vehicles/{vehicle_id}",
            200
        )
        return success, response

    def test_get_campaigns(self):
        """Test getting active campaigns"""
        success, response = self.run_test(
            "Get Active Campaigns",
            "GET",
            "campaigns",
            200
        )
        return success, response

    def test_create_contact_message(self):
        """Test contact form submission"""
        test_message = {
            "name": "João Silva",
            "email": "joao.silva@email.pt",
            "phone": "+351912345678",
            "message": "Olá, gostaria de saber mais informações sobre uma viatura BMW que vi no vosso site. Obrigado!"
        }
        success, response = self.run_test(
            "Create Contact Message",
            "POST",
            "contacts",
            200,
            data=test_message
        )
        return success, response

    def test_admin_contacts(self):
        """Test admin contact messages (requires auth)"""
        success, response = self.run_test(
            "Get Contact Messages (Admin)",
            "GET",
            "contacts",
            200
        )
        return success, response

    def test_admin_campaigns(self):
        """Test admin campaigns endpoint (requires auth)"""
        success, response = self.run_test(
            "Get All Campaigns (Admin)",
            "GET",
            "campaigns/all",
            200
        )
        return success, response

def main():
    print("🚀 Starting dANI.PT Supabase API Testing")
    print("=" * 50)
    
    tester = dANISupabaseAPITester()
    
    # Test health check first
    print("\n🏥 TESTING HEALTH CHECK")
    print("-" * 30)
    tester.test_health_check()
    
    # Test public endpoints
    print("\n📋 TESTING PUBLIC ENDPOINTS")
    print("-" * 30)
    
    # Test vehicles endpoints
    vehicles_success, vehicles_data = tester.test_get_vehicles()
    
    # Test vehicle filtering by brand
    tester.test_get_vehicles_by_brand("BMW")
    
    # Test a specific vehicle if any exist
    if vehicles_success and vehicles_data and len(vehicles_data) > 0:
        first_vehicle_id = vehicles_data[0]['id']
        tester.test_get_vehicle_by_id(first_vehicle_id)
    
    # Test campaigns
    tester.test_get_campaigns()
    
    # Test contact form
    tester.test_create_contact_message()
    
    # Test admin authentication
    print("\n🔐 TESTING ADMIN AUTHENTICATION")
    print("-" * 30)
    
    # Try to login - if no admin user exists, this is expected to fail
    login_success = tester.test_admin_login("admin@dani.pt", "admin123")
    
    if login_success:
        print("\n👑 TESTING ADMIN ENDPOINTS")
        print("-" * 30)
        
        # Test admin endpoints
        tester.test_admin_contacts()
        tester.test_admin_campaigns()
    else:
        print("ℹ️  Admin login failed - this is expected if no admin user exists yet")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests ({len(tester.failed_tests)}):")
        for i, test in enumerate(tester.failed_tests, 1):
            print(f"{i}. {test['name']}")
            if 'expected' in test:
                print(f"   Expected: {test['expected']}, Got: {test['actual']}")
                print(f"   Response: {test['response']}")
            if 'error' in test:
                print(f"   Error: {test['error']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())