export interface Estado {
    id: number;
    estado: string;
}

export interface Sector {
    id: number;
    nombre: string;
}

export interface Centro {
    id: number;
    nombre: string;
    sector: string; 
}

export interface Puesto {
    id: number;
    descripcion: string;
}