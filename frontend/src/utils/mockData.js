// Mock data para demonstração quando o backend não está disponível

export const mockVehicles = [
  {
    id: '1',
    brand: 'BMW',
    model: '320d',
    year: 2020,
    price: 28500,
    mileage: 45000,
    fuel_type: 'Diesel',
    transmission: 'Automática',
    color: 'Preto',
    is_featured: true,
    description: 'BMW 320d em excelente estado. Revisões em dia, único dono.',
    features: ['GPS', 'Cruise Control', 'Sensores Estacionamento', 'Bluetooth'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
    ],
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    brand: 'Mercedes-Benz',
    model: 'Classe A 180',
    year: 2021,
    price: 32000,
    mileage: 25000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    color: 'Branco',
    is_featured: true,
    description: 'Mercedes Classe A como novo. Garantia de fábrica até 2026.',
    features: ['MBUX', 'LED', 'Keyless', 'Câmara Traseira'],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
    ],
    created_at: '2025-01-14T10:00:00Z'
  },
  {
    id: '3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2022,
    price: 45000,
    mileage: 15000,
    fuel_type: 'Elétrico',
    transmission: 'Automática',
    color: 'Azul',
    is_featured: true,
    description: 'Tesla Model 3 Standard Range Plus. Autopilot incluído.',
    features: ['Autopilot', 'Supercharger', 'Vidros Panorâmicos', 'App Mobile'],
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800'
    ],
    created_at: '2025-01-13T10:00:00Z'
  },
  {
    id: '4',
    brand: 'Audi',
    model: 'A4 Avant',
    year: 2019,
    price: 26500,
    mileage: 60000,
    fuel_type: 'Diesel',
    transmission: 'Automática',
    color: 'Cinzento',
    is_featured: false,
    description: 'Audi A4 Avant impecável. Full extras.',
    features: ['Virtual Cockpit', 'Matrix LED', 'Bang & Olufsen', 'Teto Panorâmico'],
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
    ],
    created_at: '2025-01-12T10:00:00Z'
  },
  {
    id: '5',
    brand: 'Volkswagen',
    model: 'Golf GTI',
    year: 2020,
    price: 29000,
    mileage: 35000,
    fuel_type: 'Gasolina',
    transmission: 'Manual',
    color: 'Vermelho',
    is_featured: false,
    description: 'Golf GTI Mk8. Performance Pack.',
    features: ['DCC', 'Diff. Eletrónico', 'Bancos Desportivos', 'Escape Desportivo'],
    images: [
      'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'
    ],
    created_at: '2025-01-11T10:00:00Z'
  },
  {
    id: '6',
    brand: 'Peugeot',
    model: '3008 GT',
    year: 2021,
    price: 31000,
    mileage: 28000,
    fuel_type: 'Híbrido',
    transmission: 'Automática',
    color: 'Preto',
    is_featured: false,
    description: 'Peugeot 3008 Hybrid4. 4x4, 300cv.',
    features: ['i-Cockpit', 'Focal', 'Massagem', 'Night Vision'],
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
    ],
    created_at: '2025-01-10T10:00:00Z'
  },
  {
    id: '7',
    brand: 'Toyota',
    model: 'Corolla Hybrid',
    year: 2022,
    price: 27500,
    mileage: 18000,
    fuel_type: 'Híbrido',
    transmission: 'CVT',
    color: 'Prata',
    is_featured: false,
    description: 'Toyota Corolla Hybrid. Consumos de 4L/100km.',
    features: ['Toyota Safety Sense', 'JBL', 'Head-Up Display', 'Carregador Wireless'],
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'
    ],
    created_at: '2025-01-09T10:00:00Z'
  },
  {
    id: '8',
    brand: 'Renault',
    model: 'Clio RS Line',
    year: 2021,
    price: 18500,
    mileage: 22000,
    fuel_type: 'Gasolina',
    transmission: 'Manual',
    color: 'Branco',
    is_featured: false,
    description: 'Renault Clio RS Line. Pack desportivo completo.',
    features: ['Easy Link', 'Jantes 17"', 'LED', 'Cruise Adaptativo'],
    images: [
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6b9?w=800'
    ],
    created_at: '2025-01-08T10:00:00Z'
  }
];

export const mockCampaigns = [
  {
    id: '1',
    title: 'Verão em Força',
    description: 'Descontos até 15% em carros selecionados. Aproveite para renovar o seu carro antes das férias!',
    discount_percentage: 15,
    start_date: '2025-06-01',
    end_date: '2025-08-31',
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
    applicable_vehicles: ['1', '2', '4']
  },
  {
    id: '2',
    title: 'Elétricos com Vantagem',
    description: 'Transição para elétrico nunca foi tão fácil. Financiamento com taxa 0% nos primeiros 12 meses.',
    discount_percentage: 10,
    start_date: '2025-05-01',
    end_date: '2025-12-31',
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    applicable_vehicles: ['3']
  }
];

export const mockContacts = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+351 912 345 678',
    message: 'Gostaria de saber mais informações sobre o BMW 320d.',
    vehicle_id: '1',
    created_at: '2025-01-15T14:30:00Z',
    status: 'new'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '+351 923 456 789',
    message: 'Disponibilidade para test drive do Tesla Model 3?',
    vehicle_id: '3',
    created_at: '2025-01-14T11:20:00Z',
    status: 'contacted'
  }
];
