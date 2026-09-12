/**
 * Espelha o formato de `org.springframework.data.domain.Page<T>`
 * retornado por todos os endpoints de listagem (GET sem id) da API.
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // página atual (0-based)
  size: number;
  first: boolean;
  last: boolean;
}