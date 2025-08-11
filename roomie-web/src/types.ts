export type Tenant = {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  room?: string | null; // room number for mock
  isAssigned: boolean;
};

export type Room = {
  id: string;
  number: string;
  capacity: number;
  occupants: number;
};

export type Payment = {
  id: string;
  tenant: string;
  room: string | null;
  amount: number;
  paidAt: string; // ISO date
  note?: string | null;
}; 