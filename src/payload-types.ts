/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    media: Media;
    categories: Category;
    fragrances: Fragrance;
    collections: Collection;
    coupons: Coupon;
    shippingStatuses: ShippingStatus;
    shippingAddresses: ShippingAddress;
    shippingFees: ShippingFee;
    paymentStatuses: PaymentStatus;
    orders: Order;
    conversations: Conversation;
    messages: Message;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {
    collections: {
      fragrances: 'fragrances';
    };
    conversations: {
      messages: 'messages';
    };
  };
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    categories: CategoriesSelect<false> | CategoriesSelect<true>;
    fragrances: FragrancesSelect<false> | FragrancesSelect<true>;
    collections: CollectionsSelect<false> | CollectionsSelect<true>;
    coupons: CouponsSelect<false> | CouponsSelect<true>;
    shippingStatuses: ShippingStatusesSelect<false> | ShippingStatusesSelect<true>;
    shippingAddresses: ShippingAddressesSelect<false> | ShippingAddressesSelect<true>;
    shippingFees: ShippingFeesSelect<false> | ShippingFeesSelect<true>;
    paymentStatuses: PaymentStatusesSelect<false> | PaymentStatusesSelect<true>;
    orders: OrdersSelect<false> | OrdersSelect<true>;
    conversations: ConversationsSelect<false> | ConversationsSelect<true>;
    messages: MessagesSelect<false> | MessagesSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name: string;
  avatar?: (string | null) | Media;
  roles: ('admin' | 'user')[];
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt?: string | null;
  caption?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    square?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    small?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    medium?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    large?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    xlarge?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    og?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  title: string;
  description?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "fragrances".
 */
export interface Fragrance {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string | Category;
  discount: number;
  images: (string | Media)[];
  quantity: number;
  isActive: boolean;
  fragrance: string;
  concentration: 'edc' | 'edt' | 'edp' | 'parfum';
  volume: number;
  brand: string;
  origin: string;
  scentNotes: {
    topNotes: string;
    middleNotes: string;
    baseNotes: string;
  };
  longevity: 'short' | 'medium' | 'long' | 'veryLong';
  collections?: (string | null) | Collection;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collections".
 */
export interface Collection {
  id: string;
  name: string;
  description: string;
  image?: (string | null) | Media;
  period?: {
    from?: string | null;
    to?: string | null;
  };
  fragrances?: {
    docs?: (string | Fragrance)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "coupons".
 */
export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  minimumPriceToUse: number;
  currentUse?: (string | User)[] | null;
  quantity: number;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  collectedUsers?: (string | User)[] | null;
  effectivePeriod: {
    validFrom: string;
    validTo: string;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shippingStatuses".
 */
export interface ShippingStatus {
  id: string;
  name: string;
  description?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shippingAddresses".
 */
export interface ShippingAddress {
  id: string;
  name: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  contactName: string;
  contactPhone: string;
  user: string | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shippingFees".
 */
export interface ShippingFee {
  id: string;
  name?: string | null;
  minPrice: number;
  maxPrice: number;
  fee: number;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "paymentStatuses".
 */
export interface PaymentStatus {
  id: string;
  name: string;
  description?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders".
 */
export interface Order {
  id: string;
  orderer: string | User;
  lineItems: {
    fragrance: string | Fragrance;
    versionOfFragrance: string;
    quantity: number;
    discount: number;
    price: number;
    id?: string | null;
  }[];
  coupon?: (string | null) | Coupon;
  totalPrice: number;
  finalPrice: number;
  shippingFee: number;
  shippingStatus: string | ShippingStatus;
  finalAddress: string | ShippingAddress;
  paymentStatus: string | PaymentStatus;
  paymentMethod: 'momo' | 'cod';
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "conversations".
 */
export interface Conversation {
  id: string;
  name: string;
  participants: (string | User)[];
  messages?: {
    docs?: (string | Message)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "messages".
 */
export interface Message {
  id: string;
  conversation: string | Conversation;
  sender: string | User;
  role: 'Admin' | 'User';
  content?: string | null;
  attachments?:
    | {
        media: string | Media;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'categories';
        value: string | Category;
      } | null)
    | ({
        relationTo: 'fragrances';
        value: string | Fragrance;
      } | null)
    | ({
        relationTo: 'collections';
        value: string | Collection;
      } | null)
    | ({
        relationTo: 'coupons';
        value: string | Coupon;
      } | null)
    | ({
        relationTo: 'shippingStatuses';
        value: string | ShippingStatus;
      } | null)
    | ({
        relationTo: 'shippingAddresses';
        value: string | ShippingAddress;
      } | null)
    | ({
        relationTo: 'shippingFees';
        value: string | ShippingFee;
      } | null)
    | ({
        relationTo: 'paymentStatuses';
        value: string | PaymentStatus;
      } | null)
    | ({
        relationTo: 'orders';
        value: string | Order;
      } | null)
    | ({
        relationTo: 'conversations';
        value: string | Conversation;
      } | null)
    | ({
        relationTo: 'messages';
        value: string | Message;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T;
  avatar?: T;
  roles?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  caption?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
  sizes?:
    | T
    | {
        thumbnail?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        square?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        small?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        medium?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        large?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        xlarge?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        og?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
      };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories_select".
 */
export interface CategoriesSelect<T extends boolean = true> {
  title?: T;
  description?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "fragrances_select".
 */
export interface FragrancesSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  price?: T;
  category?: T;
  discount?: T;
  images?: T;
  quantity?: T;
  isActive?: T;
  fragrance?: T;
  concentration?: T;
  volume?: T;
  brand?: T;
  origin?: T;
  scentNotes?:
    | T
    | {
        topNotes?: T;
        middleNotes?: T;
        baseNotes?: T;
      };
  longevity?: T;
  collections?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collections_select".
 */
export interface CollectionsSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  image?: T;
  period?:
    | T
    | {
        from?: T;
        to?: T;
      };
  fragrances?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "coupons_select".
 */
export interface CouponsSelect<T extends boolean = true> {
  code?: T;
  description?: T;
  minimumPriceToUse?: T;
  currentUse?: T;
  quantity?: T;
  discountType?: T;
  discountAmount?: T;
  collectedUsers?: T;
  effectivePeriod?:
    | T
    | {
        validFrom?: T;
        validTo?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shippingStatuses_select".
 */
export interface ShippingStatusesSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shippingAddresses_select".
 */
export interface ShippingAddressesSelect<T extends boolean = true> {
  name?: T;
  province?: T;
  district?: T;
  ward?: T;
  detailAddress?: T;
  contactName?: T;
  contactPhone?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shippingFees_select".
 */
export interface ShippingFeesSelect<T extends boolean = true> {
  name?: T;
  minPrice?: T;
  maxPrice?: T;
  fee?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "paymentStatuses_select".
 */
export interface PaymentStatusesSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders_select".
 */
export interface OrdersSelect<T extends boolean = true> {
  orderer?: T;
  lineItems?:
    | T
    | {
        fragrance?: T;
        versionOfFragrance?: T;
        quantity?: T;
        discount?: T;
        price?: T;
        id?: T;
      };
  coupon?: T;
  totalPrice?: T;
  finalPrice?: T;
  shippingFee?: T;
  shippingStatus?: T;
  finalAddress?: T;
  paymentStatus?: T;
  paymentMethod?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "conversations_select".
 */
export interface ConversationsSelect<T extends boolean = true> {
  name?: T;
  participants?: T;
  messages?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "messages_select".
 */
export interface MessagesSelect<T extends boolean = true> {
  conversation?: T;
  sender?: T;
  role?: T;
  content?: T;
  attachments?:
    | T
    | {
        media?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}