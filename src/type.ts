import { Person } from "@store/person/person-slice";
import { Schedule } from "@store/schedule/schedule-slice";
import { Venue } from "@store/venue/venueSlice";
export interface TextType {
  id?: string;
  area: string;
  text: string;
  updatedAt?: Date;
  created_at?: Date;
  position: number;
  title: string | null;
}
export interface ClauseType {
  id?: string;
  text?: string;
  updatedAt?: Date;
  created_at?: Date;
  position?: number;
  title?: string | null;
}

export interface OwnerType {
  id?: string;
  cep?: string;
  cpf?: string;
  pix?: string;
  city?: string;
  state?: string;
  street?: string;
  bankName?: string;
  bankAgency?: string;
  rg?: string | null;
  streetNumber?: string;
  neighborhood?: string;
  completeName?: string;
  organizationId?: string;
  bankAccountNumber?: string;
  complement?: string | null;
}

export interface QuestionType {
  id?: string;
  question: string;
  response: string;
  venueId: string;
}
export interface ContactType {
  id?: string;
  name: string;
  role: string;
  venueId: string;
  whatsapp: string;
}

export interface ImageType {
  id?: string;
  tag: string;
  position: number;
  imageUrl: string;
  description: string;
  responsiveMode: string;
}
export interface DateEventType {
  id: string;
  type: string;
  venue: Venue;
  title: string;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  venueId: string;
  startDate: Date;
  proposalId: string;
  proposal: ProposalType;
  notifications: Notification[]
}
export interface EspenseType {
  id?: string;
  tipo: string;
  valor: number;
  descricao: string;
  categoria: string;
  dataPagamento: string;
  recorrente: boolean;
  orcamentoId?: string | null;
}

export interface NotificationType {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  proposalId: string;
  dateEventId: string;
  proposal: ProposalType
  dateEvent: DateEventType;
  type: "VISIT" | "EVENT" | "ALERT" | "PROPOSAL";
}

export interface GuestType {
  id: string;
  name: string;
  rg: string | null;
  proposalId: string;
  email: string | null;
}

export interface PaymentType {
  id?: string;
  amount: number;
  venueId: string;
  imageUrl: string;
  proposalId: string;
  paymentDate: string;
}

export interface ProposalService {
  id?: string;
  serviceId: string;
  proposalId: string;
  service: ServiceType;
  proposal: ProposalType;
}

export interface ServiceType {
  id?: string;
  name: string;
  venue: Venue;
  price: number;
  venueId: string;
  proposalServices: ProposalService[];
}
export interface ContractType {
  id?: string;
  title?: string;
  name?: string;
  contractId?: string;
  organizationId?: string;
  clauses?: ClauseType[];
}
export interface OwnerVenueType {
  id?: string;
  owner: OwnerType;
}

export interface ClientType{
  cep?: string;
  cpf?: string;
  rg?: string;
  city?: string;
  state?: string;
  street?: string;
  completeName?: string;
  streetNumber?: string;
  neighborhood?: string;
}

export interface History { action: string, username?: string, createdAt: Date, id: string }
export interface ProposalType {
  id?: string;
  cep?: string;
  cpf?: string;
  rg?: string;
  name: string;
  venue: Venue;
  city?: string;
  endDate: Date;
  email: string;
  paid: boolean;
  state?: string;
  street?: string;
  streetNumber?: string;
  startDate: Date;
  venueId: string;
  updatedAt: Date;
  createdAt: Date;
  whatsapp: string;
  contact: boolean;
  approved: Boolean;
  basePrice: number;
  amountPaid: number;
  description: string;
  totalAmount: number;
  knowsVenue: boolean;
  guestNumber: number;
  completeName: string;
  streetnumber?: string;
  neighborhood?: string;
  extraHoursQty: number;
  extraHourPrice: number;
  termsAccepted: boolean;
  personList: Person[]
  histories: History[];
  payments: PaymentType[]
  scheduleList: Schedule[]
  dateEvents: DateEventType[]
  proposalServices: ProposalService[]
  type: "EVENT" | "OTHER" | "BARTER" | "PRODUCTION"
  trafficSource: "AIRBNB" | "GOOGLE" | "INSTAGRAM" | "TIKTOK" | "OTHER" | "FRIEND" | "FACEBOOK"
}
