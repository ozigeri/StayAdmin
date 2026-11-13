export enum EPropertyCategory {
  Hotel = 'Hotel',
  Pension = 'Pension',
  Apartment = 'Apartment',
  Guesthouse = 'Guesthouse',
}

export interface RoomPrices {
  Standard: number;
  Superior: number;
  Family: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  address: string;
  category: EPropertyCategory;
  description: string;
  imageUrl: string;
  roomPrices: RoomPrices;
}

export interface PropertyListItem {
  id: string;
  name: string;
  location: string;
  category: EPropertyCategory;
  imageUrl: string;
}

export interface PropertyDto {
  name: string;
  location: string;
  address: string;
  category: EPropertyCategory;
  description: string;
  imageUrl: string;
  roomPrices: RoomPrices;
}
