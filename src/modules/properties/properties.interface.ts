import type { PropertyWhereInput } from "../../../generated/prisma/models";

export interface IPropertyQuery extends PropertyWhereInput{
    sortBy?: string;
    sortOrder?: string;

    searchTerm?: string;

    limit?: string;
    page?: string;

    minRent?: string;
    maxRent?: string;
    type?: string

}