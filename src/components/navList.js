import FolderOpen from '@mui/icons-material/FolderOpen';
import Search from '@mui/icons-material/Search';
import { AddCircle, Cottage, Handshake, Phishing, Sailing } from '@mui/icons-material';
import { getCurrentUser } from '../service/AuthService';
import InsightsIcon from '@mui/icons-material/Insights';
import ReviewsIcon from '@mui/icons-material/Reviews';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EuroIcon from '@mui/icons-material/Euro';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const navbarDefaultList = [
  {
    icon: Search,
    desc: 'Search',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/'
  },
  {
    icon: Cottage,
    desc: 'Cottages',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/showCottages'
  },
  {
    icon: Sailing,
    desc: 'Boats',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/showBoats'
  },
  {
    icon: Phishing,
    desc: 'Adventures',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/showAdventures'
  },

];

export default function getNavbarList() {
  let curUser = getCurrentUser();
  if (curUser === null || curUser === undefined || Object.keys(curUser).length === 0)
    return navbarDefaultList;

  switch (curUser.userType.name) {
    case 'ROLE_ADMIN':
      return navbarAdminList;
    case 'ROLE_CLIENT':
      return navbarClientList;
    case 'ROLE_COTTAGE_OWNER':
      return navbarCotOwnList;
    case 'ROLE_SHIP_OWNER':
      return navbarShipOwnList;
    case 'ROLE_INSTRUCTOR':
      return navbarInstList;
    case 'ROLE_SUPER_ADMIN':
      return navbarSuperAdminList;
    default:
      return navbarDefaultList;
  }
}

const navbarClientList = [
  ...navbarDefaultList,
  {
    icon: Handshake,
    desc: 'My Reservations',
    secondDesc: '',
    badge: 0,
    subList: [],
    url:'/myReservations'
  },
  {
    icon: FavoriteIcon,
    desc: 'Subscribed Entities',
    secondDesc: '',
    badge: 0,
    subList: [],
    url:'/likedEntites'
  }
]

const navbarCotOwnList = [
  ...navbarDefaultList,
  {
    icon: AddCircle,
    desc: 'Add New Cottage',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/addCottage'
  },
  {
    icon: FolderOpen,
    desc: 'My Cottages',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/cottages'
  },
  {
    icon: Handshake,
    desc: 'Reservations',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/showReservationsOwner'
  },
  {
    icon: InsightsIcon,
    desc: 'Analytics',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/analytics'
  },
  {
    icon: CalendarMonthIcon,
    desc: 'Calendar',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/calendar'
  }
]

const navbarShipOwnList = [
  ...navbarDefaultList,
  {
    icon: AddCircle,
    desc: 'Add New Ship',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/addShip'
  },
  {
    icon: FolderOpen,
    desc: 'My Ships',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/ships'
  },
  {
    icon: Handshake,
    desc: 'Reservations',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/showReservationsOwner'
  },
  {
    icon: InsightsIcon,
    desc: 'Analytics',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/analytics'
  },
  {
    icon: CalendarMonthIcon,
    desc: 'Calendar',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/calendar'
  }
]

const navbarInstList = [
  ...navbarDefaultList,
  {
    icon: AddCircle,
    desc: 'Add New Adventure',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/addAdventure'
  },
  {
    icon: FolderOpen,
    desc: 'My Adventures',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/adventures'
  },
  {
    icon: Handshake,
    desc: 'Reservations',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/showReservationsOwner'
  },
  {
    icon: InsightsIcon,
    desc: 'Analytics',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/analytics'
  },
  {
    icon: CalendarMonthIcon,
    desc: 'Calendar',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/calendar'
  }
]

const allRequests = {
  icon: FormatListBulletedIcon,
  desc: 'All requests',
  secondDesc: '',
  badge: 0,
  subList: [],
  url: '/allRequestsCardsForAdmin'
}

const loyaltyProgram = {
  icon: MilitaryTechIcon,
  desc: 'Loyalty program',
  secondDesc: '',
  badge: 0,
  subList: [],
  url: '/loyaltyProgram'
}


const systemRevenue = {
  icon: EuroIcon,
  desc: 'System revenue',
  secondDesc: '',
  badge: 0,
  subList: [],
  url: '/systemRevenue'
}

const allUsers = {
  icon: PeopleAltIcon,
  desc: 'All users',
  secondDesc: '',
  badge: 0,
  subList: [],
  url: '/allUsers'
}

const navbarSuperAdminList = [
  ...navbarDefaultList,
  allUsers,
  {
    icon: AddCircle,
    desc: 'Add New Admin',
    secondDesc: '',
    badge: 0,
    subList: [],
    url: '/addAdmin'
  },
  allRequests,
  loyaltyProgram,
  systemRevenue
]

const navbarAdminList = [
  ...navbarDefaultList,  
  allUsers,
  allRequests,
  loyaltyProgram,
  systemRevenue
]