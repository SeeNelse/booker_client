-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 22 2019 г., 03:48
-- Версия сервера: 5.7.23
-- Версия PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `booker`
--

-- --------------------------------------------------------

--
-- Структура таблицы `booker_users`
--

CREATE TABLE `booker_users` (
  `user_id` int(6) NOT NULL,
  `user_name` varchar(64) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `user_email` varchar(64) NOT NULL,
  `status` enum('active','not_active') NOT NULL,
  `role_id` int(6) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `log_in_time` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `booker_users`
--

INSERT INTO `booker_users` (`user_id`, `user_name`, `user_pass`, `user_email`, `status`, `role_id`, `token`, `log_in_time`) VALUES
(1, 'user1', '$2b$10$FcB3ZVyuwa4624lgtRQiUusYeGiXbWE9.u/4RqDCffSpMpcfqtAda', 'email1@gmail.com', 'active', 2, '$2b$10$dkc4f/hMhlHYWm0m79yAS.WVPKJJArUaFZr1NbFhcxTqaxmu9klfa', '1563701575437'),
(2, 'admin', '$2b$10$outraCPl.xr3YxCOTFtG0.J7K1HeU3qve6f6KcYnXUdu3gyFT.S26', 'admin@gmail.com', 'active', 1, '$2b$10$yV643lHDic21W6DJnMsb8Os5cRhaGosHR70o9gL2Acduk2BhH/W.u', '1563700615047'),
(3, 'user2', '$2b$10$S3hTEsQJt3jRaj8MnPoj3.b2aptu8D1t76PiBuF4duO44nAGnhVjq', 'email2@gmail.com', 'active', 2, '$2b$10$xpjS8HEB9E/xlnwWGkYqne/IyH.0H2SKe08Gx.ae321tr7VU8d1OO', '1563702181180');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `booker_users`
--
ALTER TABLE `booker_users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `booker_users`
--
ALTER TABLE `booker_users`
  MODIFY `user_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
