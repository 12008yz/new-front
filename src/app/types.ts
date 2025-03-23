export interface User {
   id: number; // Используем number, так как в PostgreSQL идентификаторы - это INTEGER
   username: string;
   profilePicture: string; // URL изображения профиля
   walletBalance: number; // Баланс кошелька
   level: number; // Уровень пользователя
   xp: number; // Опыт пользователя
   nextBonus: Date; // Дата следующего бонуса
   fixedItem?: { // Опционально, если фиксированный предмет не установлен
       image: string;
       name: string;
       description: string;
       rarity: string; // Редкость предмета
   };
   hasUnreadNotifications: boolean; // Статус наличия непрочитанных уведомлений
   // Удалено поле token
   weeklyWinnings: number;
   inventory: BasicItem[]
}

export interface IMarketItem {
   id: number; // Используем number, так как в PostgreSQL идентификаторы - это INTEGER
   sellerId: {
       id: number; // Идентификатор продавца
       username: string; // Имя пользователя продавца
   };
   item: {
       id: number; // Идентификатор предмета
       name: string; // Название предмета
       image: string; // URL изображения предмета
       uniqueId: string; // Уникальный идентификатор предмета
   };
   price: number; // Цена предмета
   itemName: string; // Название предмета для отображения
   itemImage: string; // URL изображения предмета
   uniqueId: string; // Уникальный идентификатор объявления
   __v?: number; // Версия, если используется
}

export interface BasicItem {
   caseId: number; // Идентификатор кейса
   image: string; // URL изображения
   name: string; // Название предмета
   rarity: string; // Редкость предмета
   id: number; // Идентификатор предмета
   uniqueId: string; // Уникальный идентификатор
}

export interface Case {
   id: number; // Идентификатор кейса
   title: string; // Заголовок кейса
   price: number; // Цена кейса
   image: string; // URL изображения кейса
   items: BasicItem[]; // Массив предметов в кейсе
   user: {
      id: number;
      username: string;
      profilePicture: string;
    };
}

export interface CaseOpeningItem {
   caseImage: string; // URL изображения кейса
   user: {
     id: string; // Идентификатор пользователя
     name: string; // Имя пользователя
     profilePicture: string; // URL изображения профиля
   };
   winningItems: BasicItem[]; // Массив выигранных предметов
 }
