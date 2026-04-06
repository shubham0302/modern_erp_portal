import type { AddressTypeEnum } from "@/enum/addressType.enum";

export interface Address {
  lat?: number;
  lng?: number;
  ownAddress: boolean;
  personName: string;
  personPhone: string;
  addressType: AddressTypeEnum;
  line1: string;
  line2?: string;
  area: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  customerId: string;
  saveAddressAs: string;
  totalOrders: number;
  zoneId: string;
  isDefault: boolean;
  uniqueId: string;
  createdDate: number;
  updatedDate: number;
  active: boolean;
}
