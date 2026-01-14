"""
Seed data for dANI.PT - Create example vehicles and campaigns
"""
import asyncio
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal
from models import Vehicle, Campaign
import uuid
from datetime import datetime, timedelta, timezone

# Imagens de carros do Unsplash (alta qualidade)
VEHICLE_IMAGES = {
    "bmw_serie3": [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80"
    ],
    "mercedes_c": [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076536-5e0e11d8ecf2?w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80"
    ],
    "audi_a4": [
        "https://images.unsplash.com/photo-1610768764270-790fbec18178?w=1200&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
        "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80"
    ],
    "volkswagen_golf": [
        "https://images.unsplash.com/photo-1622109647063-34f6099d1db1?w=1200&q=80",
        "https://images.unsplash.com/photo-1611821064430-f18e754f0e8e?w=1200&q=80",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80"
    ],
    "tesla_model3": [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80",
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
        "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=1200&q=80"
    ],
    "peugeot_3008": [
        "https://images.unsplash.com/photo-1592853625597-7d17be820d0c?w=1200&q=80",
        "https://images.unsplash.com/photo-1583267746897-c318b28a3b7a?w=1200&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80"
    ],
    "volvo_xc60": [
        "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80"
    ],
    "bmw_x3": [
        "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80"
    ],
    "mercedes_glc": [
        "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=1200&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80"
    ],
    "renault_clio": [
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
        "https://images.unsplash.com/photo-1583267746897-c318b28a3b7a?w=1200&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80"
    ]
}

VEHICLES_DATA = [
    {
        "brand": "BMW",
        "model": "Série 3 320d",
        "year": 2021,
        "price": 38500,
        "fuel_type": "Diesel",
        "mileage": 45000,
        "transmission": "Automático",
        "color": "Preto",
        "power": "190cv",
        "description": "BMW Série 3 em excelente estado de conservação. Totalmente revisto, com livro de manutenção completo. Interior em pele, navegação GPS, sensores de estacionamento e câmara traseira.",
        "features": ["GPS", "Câmara traseira", "Sensores estacionamento", "Cruise control", "Bancos em pele", "Jantes 18\"", "LED", "Bluetooth"],
        "images": VEHICLE_IMAGES["bmw_serie3"],
        "is_featured": True,
        "is_sold": False
    },
    {
        "brand": "Mercedes-Benz",
        "model": "Classe C 220d",
        "year": 2020,
        "price": 42000,
        "fuel_type": "Diesel",
        "mileage": 38000,
        "transmission": "Automático",
        "color": "Cinzento",
        "power": "194cv",
        "description": "Mercedes-Benz Classe C impecável. Pack AMG, interior premium, sistema de som de alta qualidade. Revisão recente na rede oficial. Garantia incluída.",
        "features": ["Pack AMG", "GPS", "Teto panorâmico", "Sensores 360°", "Bancos aquecidos", "Assistente de faixa", "LED Matrix", "Keyless"],
        "images": VEHICLE_IMAGES["mercedes_c"],
        "is_featured": True,
        "is_sold": False
    },
    {
        "brand": "Audi",
        "model": "A4 2.0 TDI",
        "year": 2019,
        "price": 32000,
        "fuel_type": "Diesel",
        "mileage": 62000,
        "transmission": "Automático",
        "color": "Branco",
        "power": "150cv",
        "description": "Audi A4 muito bem estimado, um único dono. Manutenção sempre realizada na rede oficial. Virtual cockpit, MMI navigation plus, e pack S-Line.",
        "features": ["Virtual Cockpit", "GPS", "S-Line", "Sensores", "Cruise adaptativo", "Bancos desportivos", "LED", "Entrada USB"],
        "images": VEHICLE_IMAGES["audi_a4"],
        "is_featured": True,
        "is_sold": False
    },
    {
        "brand": "Volkswagen",
        "model": "Golf 1.5 TSI",
        "year": 2022,
        "price": 28500,
        "fuel_type": "Gasolina",
        "mileage": 18000,
        "transmission": "Manual",
        "color": "Azul",
        "power": "130cv",
        "description": "VW Golf 8ª geração praticamente novo. Baixa quilometragem, ainda em garantia de fábrica. Sistema de infoentretenimento moderno com ecrã táctil de 10\".",
        "features": ["Digital Cockpit", "App Connect", "Sensores", "Cruise control", "Climatização", "Jantes 17\"", "LED", "Bluetooth"],
        "images": VEHICLE_IMAGES["volkswagen_golf"],
        "is_featured": False,
        "is_sold": False
    },
    {
        "brand": "Tesla",
        "model": "Model 3 Long Range",
        "year": 2021,
        "price": 45000,
        "fuel_type": "Elétrico",
        "mileage": 32000,
        "transmission": "Automático",
        "color": "Branco",
        "power": "350cv",
        "description": "Tesla Model 3 Long Range com autonomia de 580km. Piloto automático, carregamento rápido, interior minimalista premium. Bateria em excelente estado (97% capacidade).",
        "features": ["Autopilot", "Teto panorâmico", "Supercharger", "App Tesla", "Câmaras 360°", "Sistema som premium", "Navegação integrada", "Carregamento rápido"],
        "images": VEHICLE_IMAGES["tesla_model3"],
        "is_featured": False,
        "is_sold": False
    },
    {
        "brand": "Peugeot",
        "model": "3008 1.5 BlueHDi",
        "year": 2020,
        "price": 26500,
        "fuel_type": "Diesel",
        "mileage": 48000,
        "transmission": "Automático",
        "color": "Cinzento",
        "power": "130cv",
        "description": "Peugeot 3008 SUV familiar, espaçoso e confortável. i-Cockpit, grip control para terrenos difíceis. Ideal para família.",
        "features": ["i-Cockpit", "GPS 3D", "Grip Control", "Pack Visibilidade", "Sensores", "Câmara traseira", "Cruise control", "Porta-bagagens elétrica"],
        "images": VEHICLE_IMAGES["peugeot_3008"],
        "is_featured": False,
        "is_sold": False
    },
    {
        "brand": "Volvo",
        "model": "XC60 D4",
        "year": 2019,
        "price": 38000,
        "fuel_type": "Diesel",
        "mileage": 55000,
        "transmission": "Automático",
        "color": "Preto",
        "power": "190cv",
        "description": "Volvo XC60 premium, conhecido pela segurança e conforto. City Safety, Pilot Assist, interior escandinavo elegante.",
        "features": ["Pilot Assist", "City Safety", "GPS", "Bancos aquecidos", "Teto panorâmico", "Sistema Bowers & Wilkins", "LED", "Sensores 360°"],
        "images": VEHICLE_IMAGES["volvo_xc60"],
        "is_featured": False,
        "is_sold": False
    },
    {
        "brand": "BMW",
        "model": "X3 xDrive20d",
        "year": 2020,
        "price": 44000,
        "fuel_type": "Diesel",
        "mileage": 42000,
        "transmission": "Automático",
        "color": "Branco",
        "power": "190cv",
        "description": "BMW X3 SUV com tração integral xDrive. Condução dinâmica, interior espaçoso, perfeito para longas viagens. Pack M Sport incluído.",
        "features": ["xDrive 4x4", "Pack M Sport", "GPS Pro", "Teto panorâmico", "Bancos elétricos", "Assistente de estacionamento", "LED Adaptativos", "Harman Kardon"],
        "images": VEHICLE_IMAGES["bmw_x3"],
        "is_featured": False,
        "is_sold": False
    },
    {
        "brand": "Mercedes-Benz",
        "model": "GLC 220d 4MATIC",
        "year": 2021,
        "price": 48500,
        "fuel_type": "Diesel",
        "mileage": 35000,
        "transmission": "Automático",
        "color": "Cinzento",
        "power": "194cv",
        "description": "Mercedes GLC com tração integral 4MATIC. SUV luxuoso e versátil. MBUX, assistentes de condução, conforto premium.",
        "features": ["4MATIC", "MBUX", "Teto panorâmico", "Pack AMG", "Câmara 360°", "Bancos memória", "LED High Performance", "Assistente ativo"],
        "images": VEHICLE_IMAGES["mercedes_glc"],
        "is_featured": False,
        "is_sold": False
    },
    {
        "brand": "Renault",
        "model": "Clio 1.0 TCe",
        "year": 2022,
        "price": 18500,
        "fuel_type": "Gasolina",
        "mileage": 12000,
        "transmission": "Manual",
        "color": "Vermelho",
        "power": "100cv",
        "description": "Renault Clio como novo, ideal para cidade. Económico, ágil e moderno. Ecrã tátil com Android Auto e Apple CarPlay.",
        "features": ["Android Auto", "Apple CarPlay", "Sensores traseiros", "Cruise control", "Climatização", "Jantes liga leve", "LED diurnos", "Bluetooth"],
        "images": VEHICLE_IMAGES["renault_clio"],
        "is_featured": False,
        "is_sold": False
    }
]

CAMPAIGNS_DATA = [
    {
        "title": "Black Friday dANI.PT",
        "description": "Descontos até 15% em viaturas selecionadas. Aproveite esta oportunidade única para garantir o seu próximo carro com um preço especial.",
        "discount_percentage": 15,
        "start_date": datetime.now(timezone.utc) - timedelta(days=5),
        "end_date": datetime.now(timezone.utc) + timedelta(days=25),
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
        "applicable_vehicle_ids": []
    },
    {
        "title": "Campanha Premium",
        "description": "Modelos BMW, Mercedes e Audi com condições especiais de financiamento. Taxa a partir de 4,9% TAEG.",
        "discount_percentage": 10,
        "start_date": datetime.now(timezone.utc) - timedelta(days=10),
        "end_date": datetime.now(timezone.utc) + timedelta(days=20),
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
        "applicable_vehicle_ids": []
    }
]

async def seed_vehicles():
    """Seed vehicles data"""
    async with AsyncSessionLocal() as session:
        print("🚗 Creating vehicles...")
        
        for vehicle_data in VEHICLES_DATA:
            vehicle = Vehicle(
                id=str(uuid.uuid4()),
                **vehicle_data
            )
            session.add(vehicle)
            print(f"  ✓ {vehicle.brand} {vehicle.model} ({vehicle.year})")
        
        await session.commit()
        print(f"\n✅ Created {len(VEHICLES_DATA)} vehicles successfully!\n")

async def seed_campaigns():
    """Seed campaigns data"""
    async with AsyncSessionLocal() as session:
        print("🎯 Creating campaigns...")
        
        for campaign_data in CAMPAIGNS_DATA:
            campaign = Campaign(
                id=str(uuid.uuid4()),
                **campaign_data
            )
            session.add(campaign)
            print(f"  ✓ {campaign.title}")
        
        await session.commit()
        print(f"\n✅ Created {len(CAMPAIGNS_DATA)} campaigns successfully!\n")

async def main():
    """Main seed function"""
    print("\n" + "="*60)
    print("  dANI.PT - Seeding Database")
    print("="*60 + "\n")
    
    await seed_vehicles()
    await seed_campaigns()
    
    print("="*60)
    print("  🎉 Database seeded successfully!")
    print("="*60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
