// constants.ts
export interface Post {
    id: number;
    title: {
      rendered: string;
    };
    registered: 'Yes' | 'No';
    address: string;
    price?: string;
    header_image?: string;
    logo_image?: string;
    facebook?: string;
    whatsapp?: string;
    instagram?: string;
    content: {
      rendered: string;
    };
    description?: string;
    latitude: number;
    longitude: number;
    full_day_care?: 'Yes' | 'No';
    half_day_care?: 'Yes' | 'No';
    meals_and_snacks?: 'Yes' | 'No';
    after_school_care?: 'Yes' | 'No';
    drop_in_care?: 'Yes' | 'No';
    special_programs?: 'Yes' | 'No';
    emergency_occasional_care?: 'Yes' | 'No';
  }
  
  export const defaultCreche: Post = {
    id: 0,
    title: { rendered: 'No Title' },
    registered: 'No',
    address: 'No Address',
    price: 'No Price',
    header_image: '',
    logo_image: '',
    facebook: '',
    whatsapp: '',
    instagram: '',
    content: { rendered: 'No Content' },
    description: '',
    latitude: 0,
    longitude: 0,
    full_day_care: 'No',
    half_day_care: 'No',
    meals_and_snacks: 'No',
    after_school_care: 'No',
    drop_in_care: 'No',
    special_programs: 'No',
    emergency_occasional_care: 'No',
  };
  