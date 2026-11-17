// Devolve a mensagem de erro mais útil para mostrar ao utilizador
export const getErrorMessage = (error, fallback) => {
  // O servidor não respondeu (desligado ou sem rede)
  if (!error.response) {
    return "Não foi possível contactar o servidor. Verifica a tua ligação.";
  }
  // Erros de validação (400): o servidor explica o motivo
  if (error.response.status === 400 && error.response.data?.message) {
    return error.response.data.message;
  }
  return fallback;
};
