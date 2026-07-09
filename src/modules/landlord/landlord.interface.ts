export interface ICreatePropertyPayload{
    title: string;
    description?: string;
    image?: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    rent: number;
    category: ICategory
}

interface ICategory{
    name: string;
    slug: string;
    description?: string
}

export interface IUdateProertyPayload{
    description?: string;
    rent: number;
    isAvailable: boolean
}