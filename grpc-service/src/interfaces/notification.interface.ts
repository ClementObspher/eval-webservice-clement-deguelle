export interface Notification {
  id: string;
  reservationId: number;
  message: string;
  notificationDate: string;
}

export interface CreateNotificationDto {
  reservationId: number;
  message: string;
  notificationDate: string;
}

export interface UpdateNotificationDto {
  id: string;
  message: string;
  notificationDate: string;
}

export interface ExportReservationsDto {
  userId: number;
}

export interface ExportReservationsResponse {
  url: string;
}
