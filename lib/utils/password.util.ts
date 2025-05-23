/**
 * Utilitário para criptografia de senhas
 * Implementa funções para hash e verificação de senhas de forma segura
 */

import * as CryptoJS from 'crypto-js';

/**
 * Chave secreta para criptografia
 * Em um ambiente de produção, isso estaria em variáveis de ambiente
 */
const SECRET_KEY = 'sistema-gestao-municipal-security-key-2023';

/**
 * Gera um salt aleatório para uso em hashes de senha
 * @returns String de salt aleatório
 */
function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

/**
 * Criptografa uma senha usando PBKDF2 (Password-Based Key Derivation Function 2)
 * @param password Senha em texto plano
 * @param salt Salt para a criptografia (opcional)
 * @returns Objeto contendo o hash e o salt usado
 */
export function hashPassword(password: string, providedSalt?: string): { hash: string, salt: string } {
  const salt = providedSalt || generateSalt();
  
  // Usando PBKDF2 com 10000 iterações para maior segurança
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
  
  return { hash, salt };
}

/**
 * Verifica se uma senha em texto plano corresponde a um hash armazenado
 * @param password Senha em texto plano a ser verificada
 * @param storedHash Hash armazenado para comparação
 * @param salt Salt usado para gerar o hash original
 * @returns Verdadeiro se a senha corresponder ao hash
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
} 