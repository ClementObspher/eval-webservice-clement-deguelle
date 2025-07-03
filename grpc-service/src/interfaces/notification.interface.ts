export interface Notification {
  id: string;
  reservation_id: number;
  message: string;
  notificationDate: string;
}

export interface CreateNotificationDto {
  reservation_id: number;
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
