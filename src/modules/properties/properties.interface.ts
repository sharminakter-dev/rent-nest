export interface IPropertyQuery {
    sortBy?: string;
    sortOrder?: string;

    searchTerm?: string;
    isFeatured?: string;
    isAvailable?: string;

    limit?: string;
    page?: string;

    minRent?: string;
    maxRent?: string;

    bedrooms?: string;
    bathrooms?: string;

    location?: string;
    type?: string;
}