import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

const PROTO_PATH = join(__dirname, '..', 'proto', 'service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const notificationService = protoDescriptor.notification.NotificationService;

const client = new notificationService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

// Test de création d'une notification
const createNotification = () => {
  const notification = {
    reservation_id: 1,
    message: 'Test notification',
    notificationDate: new Date().toISOString(),
  };

  client.CreateNotification(
    notification,
    (error: any, response: { id: string }) => {
      if (error) {
        console.error('Erreur lors de la création:', error);
        return;
      }
      console.log('Notification créée:', response);
      // Test de récupération de la notification
      getNotification(response.id);
    },
  );
};

// Test de récupération d'une notification
const getNotification = (id: string) => {
  client.GetNotification({ id }, (error, response) => {
    if (error) {
      console.error('Erreur lors de la récupération:', error);
      return;
    }
    console.log('Notification récupérée:', response);
    // Test de mise à jour de la notification
    updateNotification(id);
  });
};

// Test de mise à jour d'une notification
const updateNotification = (id: string) => {
  const notification = {
    id,
    message: 'Notification mise à jour',
    notificationDate: new Date().toISOString(),
  };

  client.UpdateNotification(notification, (error, response) => {
    if (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return;
    }
    console.log('Notification mise à jour:', response);
  });
};

// Exécution des tests
console.log('Démarrage des tests...');
createNotification();
