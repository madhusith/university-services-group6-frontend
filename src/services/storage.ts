import { Facility } from '../types/facility';
import { Resource } from '../types/resource';
import { Reservation } from '../types/reservation';

const FACILITIES_KEY = 'group6_facilities';
const RESOURCES_KEY = 'group6_resources';
const RESERVATIONS_KEY = 'group6_reservations';

// Realistic seed data for the University Services Management Platform
const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    code: 'ENG-HUB-01',
    name: 'Ada Lovelace Engineering Complex',
    category: 'LABORATORY',
    building: 'Engineering Block A',
    floor: 'Floor 2 & 3',
    location: 'North Campus Tech Park',
    capacity: 350,
    description: 'State-of-the-art engineering laboratory and innovation hub equipped with high-performance computing, IoT rigs, and rapid prototyping workstations.',
    status: 'ACTIVE',
    operatingHours: {
      open: '08:00',
      close: '22:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    contactEmail: 'engineering-facilities@uni.ac.lk',
    contactPhone: '+94 11 234 5678',
    amenities: ['High-speed Wi-Fi 6', 'Air Conditioning', 'Power Backup UPS', 'Projectors', 'Smart Whiteboards'],
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    totalResourcesCount: 4,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'fac-2',
    code: 'SCI-AUD-02',
    name: 'Sir Arthur C. Clarke Grand Auditorium',
    category: 'AUDITORIUM',
    building: 'Main Administrative Center',
    floor: 'Ground & Mezzanine',
    location: 'Central Campus Quadrangle',
    capacity: 850,
    description: 'Premier university auditorium featuring surround acoustic isolation, motorized projection arrays, and multi-tier seating for guest lectures and symposiums.',
    status: 'ACTIVE',
    operatingHours: {
      open: '07:30',
      close: '21:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    contactEmail: 'auditorium-manager@uni.ac.lk',
    contactPhone: '+94 11 234 5679',
    amenities: ['Dolby 7.1 Sound Array', 'Dual 4K Laser Projectors', 'VIP Green Room', 'Live Broadcast Deck', 'Wheelchair Access'],
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    totalResourcesCount: 3,
    createdAt: '2026-08-05T09:30:00Z',
    updatedAt: '2026-09-18T14:20:00Z'
  },
  {
    id: 'fac-3',
    code: 'LIB-RES-03',
    name: 'Sir Isaac Newton Digital Knowledge Commons',
    category: 'LIBRARY',
    building: 'Central Library Tower',
    floor: 'Floor 4',
    location: 'East Wing Academic Crescent',
    capacity: 220,
    description: 'Quiet collaborative research space with private syndicate rooms, high-density reference terminals, and digital archives access.',
    status: 'ACTIVE',
    operatingHours: {
      open: '08:00',
      close: '23:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    contactEmail: 'library-services@uni.ac.lk',
    contactPhone: '+94 11 234 5680',
    amenities: ['Ultra-Quiet Study Pods', 'Gigabit Ethernet Drops', 'Microfilm & Archive Scanners', 'Video Conference Hub'],
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    totalResourcesCount: 4,
    createdAt: '2026-08-10T11:00:00Z',
    updatedAt: '2026-09-21T09:00:00Z'
  },
  {
    id: 'fac-4',
    code: 'SPT-ARENA-04',
    name: 'University Indoor Sports & Athletics Arena',
    category: 'SPORTS',
    building: 'Sports Complex',
    floor: 'Level 1',
    location: 'South Campus Athletic Fields',
    capacity: 500,
    description: 'Multi-purpose indoor court complex accommodating basketball, badminton, squash, and physical health activities.',
    status: 'ACTIVE',
    operatingHours: {
      open: '06:00',
      close: '21:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    contactEmail: 'sports-booking@uni.ac.lk',
    contactPhone: '+94 11 234 5681',
    amenities: ['Hardwood Maple Court', 'Locker & Shower Rooms', 'Scoreboards', 'First Aid Station'],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    totalResourcesCount: 3,
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-09-22T16:00:00Z'
  },
  {
    id: 'fac-5',
    code: 'BIO-MED-05',
    name: 'Biomedical & Nano-Science Center',
    category: 'LABORATORY',
    building: 'Science Annex West',
    floor: 'Basement & Ground',
    location: 'West Campus Bioscience Strip',
    capacity: 120,
    description: 'Cleanroom certified laboratory for microbiology, cellular genetics, and pharmaceutical research.',
    status: 'MAINTENANCE',
    operatingHours: {
      open: '09:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    contactEmail: 'biomed-safety@uni.ac.lk',
    contactPhone: '+94 11 234 5682',
    amenities: ['HEPA Filtration', 'Autoclave Facilities', 'Chemical Fume Hoods', 'Minus 80 Freezer Units'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    totalResourcesCount: 2,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-24T18:00:00Z'
  }
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    code: 'LAB-AL-301',
    name: 'Advanced AI & Machine Learning Lab',
    facilityId: 'fac-1',
    facilityName: 'Ada Lovelace Engineering Complex',
    type: 'LAB',
    capacity: 45,
    quantity: 1,
    status: 'AVAILABLE',
    requiresApproval: true,
    specs: ['40x Intel Xeon Workstations', 'NVIDIA RTX 4090 GPUs', 'Dual 4K Color-accurate Displays', 'Local Kubernetes Cluster'],
    hourlyRate: 0,
    description: 'High-spec workstation lab for deep learning training, computer vision projects, and accelerated computing research.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'res-2',
    code: 'SEM-AL-204',
    name: 'Interactive Seminar Room A',
    facilityId: 'fac-1',
    facilityName: 'Ada Lovelace Engineering Complex',
    type: 'ROOM',
    capacity: 60,
    quantity: 1,
    status: 'AVAILABLE',
    requiresApproval: false,
    specs: ['Interactive Touch Screen Display', 'Conference Microphone Array', 'Podium with HDMI & USB-C', 'Modular Seating'],
    hourlyRate: 0,
    description: 'Modern seminar space with collaborative round tables and integrated hybrid video meeting system.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-02T09:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'res-3',
    code: 'AUD-MN-01',
    name: 'Main Stage & Orchestra Hall',
    facilityId: 'fac-2',
    facilityName: 'Sir Arthur C. Clarke Grand Auditorium',
    type: 'HALL',
    capacity: 850,
    quantity: 1,
    status: 'AVAILABLE',
    requiresApproval: true,
    specs: ['Concert Grand Piano', 'Motorized Lighting Rig', 'Wireless Shure Mic Pack (12)', 'Dual Barco 4K Laser Projection'],
    hourlyRate: 5000,
    description: 'Flagship university auditorium stage suitable for convocation ceremonies, global conferences, and performance arts.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-06T10:00:00Z',
    updatedAt: '2026-09-18T14:20:00Z'
  },
  {
    id: 'res-4',
    code: 'EQ-PR-01',
    name: 'Portable High-Lumen 4K Laser Projector Kit',
    facilityId: 'fac-2',
    facilityName: 'Sir Arthur C. Clarke Grand Auditorium',
    type: 'EQUIPMENT',
    capacity: 0,
    quantity: 3,
    status: 'AVAILABLE',
    requiresApproval: false,
    specs: ['10,000 Lumens', 'Wireless Casting Support', 'Heavy-duty Tripod & Flight Case', '100ft Optical HDMI Cable'],
    hourlyRate: 0,
    description: 'Mobile projection unit for outdoor university events, academic screenings, and guest lectures.',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-08T11:00:00Z',
    updatedAt: '2026-09-18T14:20:00Z'
  },
  {
    id: 'res-5',
    code: 'LIB-SYN-401',
    name: 'Postgraduate Research Syndicate Room 401',
    facilityId: 'fac-3',
    facilityName: 'Sir Isaac Newton Digital Knowledge Commons',
    type: 'ROOM',
    capacity: 14,
    quantity: 1,
    status: 'AVAILABLE',
    requiresApproval: false,
    specs: ['65" 4K Smart Board', 'Poly Studio Video Bar', 'Magnetic Glass Boards', 'Ergonomic Herman Miller Chairs'],
    hourlyRate: 0,
    description: 'Acoustically treated conference room tailored for thesis defense, peer reviews, and executive research meetings.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-11T09:00:00Z',
    updatedAt: '2026-09-21T09:00:00Z'
  },
  {
    id: 'res-6',
    code: 'SPT-CRT-01',
    name: 'Championship Basketball & Futsal Court',
    facilityId: 'fac-4',
    facilityName: 'University Indoor Sports & Athletics Arena',
    type: 'SPORTS_COURT',
    capacity: 80,
    quantity: 1,
    status: 'AVAILABLE',
    requiresApproval: true,
    specs: ['FIBA Approved Flooring', 'LED Electronic Scoreboard', 'Spectator Bleachers (120 seats)', 'Ball Racks & Protective Netting'],
    hourlyRate: 1500,
    description: 'Indoor tournament-grade court available for inter-faculty tournaments, team practices, and recreation.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-16T14:00:00Z',
    updatedAt: '2026-09-22T16:00:00Z'
  }
];

// Helper to calculate sample dates relative to current date (e.g. today, tomorrow)
const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'resv-101',
    reservationNumber: 'RES-2026-001',
    resourceId: 'res-1',
    resourceName: 'Advanced AI & Machine Learning Lab',
    resourceType: 'LAB',
    facilityId: 'fac-1',
    facilityName: 'Ada Lovelace Engineering Complex',
    userId: 'user-fac-01',
    userName: 'Dr. Aruna Bandara',
    userEmail: 'aruna.b@uni.ac.lk',
    userRole: 'FACULTY',
    department: 'Computer Science & Engineering',
    purpose: 'Deep Learning Workshop for Final Year Research Students',
    attendeesCount: 35,
    date: todayStr,
    startTime: '10:00',
    endTime: '12:00',
    status: 'CONFIRMED',
    notes: 'Requires CUDA cluster nodes #1 through #8 enabled with PyTorch 2.4 image.',
    requiresApproval: true,
    reviewedBy: 'Admin Supervisor',
    reviewedAt: '2026-09-24T14:00:00Z',
    createdAt: '2026-09-23T10:00:00Z',
    updatedAt: '2026-09-24T14:00:00Z'
  },
  {
    id: 'resv-102',
    reservationNumber: 'RES-2026-002',
    resourceId: 'res-2',
    resourceName: 'Interactive Seminar Room A',
    resourceType: 'ROOM',
    facilityId: 'fac-1',
    facilityName: 'Ada Lovelace Engineering Complex',
    userId: 'user-stu-01',
    userName: 'Kavindu Perera',
    userEmail: 'kavindu.p@student.uni.ac.lk',
    userRole: 'STUDENT',
    department: 'Software Engineering',
    purpose: 'Group 6 Frontend Architecture & Agile Sprint Alignment',
    attendeesCount: 12,
    date: todayStr,
    startTime: '14:00',
    endTime: '16:00',
    status: 'CONFIRMED',
    notes: 'Connecting hybrid screen to team members joining remotely.',
    requiresApproval: false,
    createdAt: '2026-09-24T09:15:00Z',
    updatedAt: '2026-09-24T09:15:00Z'
  },
  {
    id: 'resv-103',
    reservationNumber: 'RES-2026-003',
    resourceId: 'res-3',
    resourceName: 'Main Stage & Orchestra Hall',
    resourceType: 'HALL',
    facilityId: 'fac-2',
    facilityName: 'Sir Arthur C. Clarke Grand Auditorium',
    userId: 'user-fac-02',
    userName: 'Prof. Senaka Mendis',
    userEmail: 'senaka.m@uni.ac.lk',
    userRole: 'FACULTY',
    department: 'Faculty of Science',
    purpose: 'National Science Symposium 2026 Keynote Address',
    attendeesCount: 500,
    date: tomorrowStr,
    startTime: '09:00',
    endTime: '13:00',
    status: 'PENDING',
    notes: 'Guest of honor arrival at 09:30. Requires live streaming deck and auditorium technician on standby.',
    requiresApproval: true,
    createdAt: '2026-09-25T08:00:00Z',
    updatedAt: '2026-09-25T08:00:00Z'
  },
  {
    id: 'resv-104',
    reservationNumber: 'RES-2026-004',
    resourceId: 'res-6',
    resourceName: 'Championship Basketball & Futsal Court',
    resourceType: 'SPORTS_COURT',
    facilityId: 'fac-4',
    facilityName: 'University Indoor Sports & Athletics Arena',
    userId: 'user-stu-02',
    userName: 'Dilki Fernando',
    userEmail: 'dilki.f@student.uni.ac.lk',
    userRole: 'STUDENT',
    department: 'Physical Education & Sports Club',
    purpose: 'Inter-University Badminton Selection Trials',
    attendeesCount: 40,
    date: dayAfterTomorrowStr,
    startTime: '15:00',
    endTime: '18:00',
    status: 'PENDING',
    notes: 'Need 4 badminton net setups and scoreboard control console.',
    requiresApproval: true,
    createdAt: '2026-09-25T11:30:00Z',
    updatedAt: '2026-09-25T11:30:00Z'
  }
];

// Initialize storage if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(FACILITIES_KEY)) {
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(INITIAL_FACILITIES));
  }
  if (!localStorage.getItem(RESOURCES_KEY)) {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(INITIAL_RESOURCES));
  }
  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
  }
};

// Facility Store Operations
export const getStoredFacilities = (): Facility[] => {
  initializeStorage();
  const data = localStorage.getItem(FACILITIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFacilities = (facilities: Facility[]): void => {
  localStorage.setItem(FACILITIES_KEY, JSON.stringify(facilities));
};

// Resource Store Operations
export const getStoredResources = (): Resource[] => {
  initializeStorage();
  const data = localStorage.getItem(RESOURCES_KEY);
  let resources: Resource[] = data ? JSON.parse(data) : [];
  
  // Auto-migrate any broken legacy URLs cached in localStorage
  let needsSave = false;
  resources = resources.map(res => {
    if (res.imageUrl && res.imageUrl.includes('photo-1581092335397-9583fe92d232')) {
      needsSave = true;
      return {
        ...res,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
      };
    }
    return res;
  });

  if (needsSave) {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
  }

  return resources;
};

export const saveResources = (resources: Resource[]): void => {
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
};

// Reservation Store Operations
export const getStoredReservations = (): Reservation[] => {
  initializeStorage();
  const data = localStorage.getItem(RESERVATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReservations = (reservations: Reservation[]): void => {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
};

// Reset to factory defaults helper (very handy for testing)
export const resetToFactoryDefaults = (): void => {
  localStorage.setItem(FACILITIES_KEY, JSON.stringify(INITIAL_FACILITIES));
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(INITIAL_RESOURCES));
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
};
