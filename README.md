Проектирование базы данных PostgreSQL

-- Создание таблицы "Организации"
CREATE TABLE Организации (
    ID SERIAL PRIMARY KEY,
    Название VARCHAR(255) NOT NULL,
    Адрес VARCHAR(255),
    Имя_руководителя VARCHAR(255),
    Номер_телефона VARCHAR(15),
    Дополнительная_информация TEXT
);

-- Создание таблицы "Заявки"
CREATE TABLE Заявки (
    ID SERIAL PRIMARY KEY,
    Организация_ID INT REFERENCES Организации(ID) ON DELETE CASCADE,
    Дата_заявки DATE NOT NULL,
    Статус VARCHAR(50) CHECK (Статус IN ('обработана', 'в ожидании', 'отклонена'))
);
