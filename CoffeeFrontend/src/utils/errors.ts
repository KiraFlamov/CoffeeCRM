import axios from "axios";

// Достаёт понятное сообщение из ответа сервера
export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return "Сервер недоступен. Проверьте подключение";
    }

    return error.response.data?.message ?? fallback;
  }

  return fallback;
};
