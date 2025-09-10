import { createContext, Dispatch, HTMLInputTypeAttribute, SetStateAction } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export type Sex = "MACHO" | "HEMBRA" | "INDETERMINADO";
export type Species = "PERRO" | "GATO" | "AVE" | "ROEDOR" | "REPTIL" | "PESCADO";
export type Role = "ADMINISTRADOR" | "VETERINARIO" | "CLIENTE" | "RECEPCIONISTA";

export interface ListItemNavProps extends NavLinkProps {
    path: string;
    name: string;
    icon: string;
    style?: boolean;
}

export interface PasswordFieldProps
    extends React.HTMLAttributes<HTMLDivElement> {
    errorMsg: string;
    viewPass: boolean;
    validData: boolean;
    showEyePass: boolean;
    hasError: boolean;
    setViewPass: (updater: (prevState: boolean) => boolean) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface InputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: boolean;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    supplier: string;
    description: string;
    expiration: Date | null;
    status: "activo" | "inactivo" | "agotado";
    image: string;
    unitMeasure: "kg" | "g" | "l" | "ml" | "unidad";
    barcode: number;
}

export interface ProductData {
    data: Product,
    meta: Meta
}

export interface User {
    name: string;
    lastName: string;
    documentType: "CC" | "CE" | "TI" | "NIT" | "PASAPORTE";
    documentNumber: string;
    address: string;
    email: string;
    password: string;
    cellPhone: string;
    role: Role;
    confirmPassword?: string;
    active?: boolean;
    mediaFile?: MediaFile;
}

export interface Pet {
    idPet: string;
    idOwner: string;
    name: string;
    species: Species;
    breed: string;
    sex: Sex;
    age: number;
    weight: number;
    sterilized: boolean;
    disability: string;
    description: string;
    isActive: boolean;
    vaccines: string[];
    surgeries: string[];
    treatments: string[];
    mediaFile?: MediaFile;
}

export interface Meta {
    creationDate: string;
    lastUpdate: string;
    ipAddress: string;
    source: string;
    nameUserCreated?: string;
    emailUserCreated?: string;
    roleUserCreated?: string;
    nameUserUpdated?: string;
    emailUserUpdated?: string;
    roleUserUpdated?: string;
}

export interface MediaFile {
    fileName: string;
    contentType: string;
    attachment: string;
}

export interface CategoryCard {
    name: string;
    img: string;
}

export interface CategoryGroup {
    name: string;
    options: string[];
}

export interface NavLinkProps {
    setOptionHover?: (option: string) => void;
    setShowSubMenu?: (show: boolean) => void;
}

export interface SubMenuProps {
    option: string;
    setShowSubMenu: (show: boolean) => void;
}

export interface LoginRequest {
    data: {
        emailOrDoc: string;
        password: string;
    };
}

export interface FormState {
    inputEmailOrDoc: string;
    inputPassword: string;
}

export interface InputErrors {
    emailOrDoc: boolean;
    password: boolean;
}

export interface UserData {
    data: User;
    meta: Meta;
    token?: string;
}

export interface PetData {
    data: Pet;
    meta: Meta;
}

export interface LoginFormProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export interface InputFieldUserRegister {
    label: string;
    type?: HTMLInputTypeAttribute;
    idInput: keyof User;
    isAdmin: boolean;
    required?: boolean;
    inputFull?: boolean;
    register: UseFormRegister<User>;
    errors: FieldErrors<User>;
}

export interface UserFiltersProps {
    searchTerm: string;
    roleFilter: string;
    statusFilter: string;
    setModalCreateClose: (close: boolean) => void;
    onSearchChange: (value: string) => void;
    onRoleFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
}

export interface UserTableProps {
    users: UserData[] | undefined;
    setUsersData: Dispatch<SetStateAction<UserData[] | undefined>>;
}

export interface PetCardProps { 
    pets: PetData[] | undefined;
    setPetsData: Dispatch<SetStateAction<PetData[] | undefined>>;
}

export interface ProductCardProps {
    products: ProductData[] | undefined;
    setProductsData: Dispatch<SetStateAction<ProductData[] | undefined>>;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export type JwtPayload = {
    exp: number;
};

export interface EditUserModalProps {
    user: User;
    meta: Meta;
    setCloseModal: (close: boolean) => void;
    confirmUpdate: (user: User, action: string) => Promise<boolean>;
}

export interface InputEditProps {
    label: string;
    value: string | undefined;
    isEditable?: boolean;
}

export interface FormUserProps extends CreateUserModalProps {
    isAdmin: boolean;
}

export interface CreateUserModalProps {
    setModalCreate?: (close: boolean) => void;
    setUsersData?: Dispatch<SetStateAction<UserData[] | undefined>>;
}

export interface SearchBarProps {
    placeholder: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export interface FormPetProps extends CreatePetModalProps { }

export interface CreatePetModalProps {
    setModalCreatePet?: (close: boolean) => void;
    setPetsData?: Dispatch<SetStateAction<PetData[] | undefined>>;
    petSelected?: PetData
}

export interface InputFieldPetRegister {
    label: string;
    type?: HTMLInputTypeAttribute;
    idInput: keyof Pet;
    required?: boolean;
    inputFull?: boolean;
    register: UseFormRegister<Pet>;
    errors: FieldErrors<Pet>;
}