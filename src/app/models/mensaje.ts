
export interface Mensaje {
  id?: number;
  contenido: string;
  fechaEnvio?: Date;
  emisorId: number;
  receptorId: number;
}
