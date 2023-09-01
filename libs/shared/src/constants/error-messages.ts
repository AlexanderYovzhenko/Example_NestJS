// App Error
const ACCESS_DENIED = 'access denied';
const UNAUTHORIZED = 'user unauthorized';
const SERVER_ERROR = 'server error';
const CANNOT_ROUTE = 'Cannot POST /auth/example';

// Query Params
const QUERY_LIMIT_SHOULD_BE_NUMBER = 'лимит должен быть числом';
const QUERY_LIMIT_MIN = 'минимальный лимит ';
const QUERY_LIMIT_MAX = 'максимальный лимит ';
const QUERY_OFFSET_SHOULD_BE_NUMBER = 'смещение должено быть числом';
const QUERY_OFFSET_MIN = 'минимальное смещение ';
const QUERY_SEARCH_SHOULD_BE = 'поиск обязательный параметр';
const QUERY_SEARCH_SHOULD_BE_LENGTH = 'длина поиска должна быть от 3 символов';
const QUERY_IS_NEWS_SHOULD_BE_BOOLEAN = 'is_news должен быть boolean';
const QUERY_IS_HIDDEN_SHOULD_BE_BOOLEAN = 'is_hidden должен быть boolean';

// Auth Error
const REFRESH_TOKEN_SHOULD_BE_STRING = 'refresh_token должен быть строкой';

// User Error
const USER_NOT_SAVED = 'пользователь не сохранён';
const USER_NOT_FOUND = 'пользователь не найден';
const USER_ADMIN_ALREADY_EXIST = 'адиминистратор уже существует';
const USER_ADMIN_CANNOT_DELETE = 'адиминистратора нельзя удалить';
const USER_ID_SHOULD_BE_NUMBER = 'user id должено быть числом';
const USER_LOGIN_EXISTS = 'логин уже зарегистрирован';
const USER_LOGIN_SHOULD_BE_STRING = 'логин должен быть строкой';
const USER_LOGIN_SHOULD_BE_LENGTH = 'длина логина должна быть от З до 30';
const USER_LOGIN_SHOULD_INCLUDE =
  'логин может содержать (латинские буквы, цифры, _, -)';
const USER_LOGIN_SHOULD_START = 'логин должен начинаться с буквы или цифры';
const USER_OVER_USER_LOGIN_SHOULD_BE_STRING =
  'логин over_user должен быть строкой';
const USER_WRONG_LOGIN_PASSWORD = 'неверный логин или пароль';
const USER_PASSWORD_SHOULD_BE_STRING = 'пароль должен быть строкой';
const USER_PASSWORD_SHOULD_BE_LENGTH = 'длина пароля должна быть от 8 до 50';
const USER_TELEGRAM_EXISTS = 'телеграм уже зарегистрирован';
const USER_TELEGRAM_SHOULD_BE_STRING = 'телеграм должен быть строкой';
const USER_TELEGRAM_SHOULD_INCLUDE = 'телеграм неверного формата';
const USER_PHONE_EXISTS = 'телефон уже зарегистрирован';
const USER_PHONE_SHOULD_BE_STRING = 'телефон должен быть строкой';
const USER_PHONE_SHOULD_BE_LENGTH = 'длина телефона должна быть от 11 до 18';
const USER_PHONE_SHOULD_INCLUDE = 'телефон должен содержать только цифры';
const USER_ROLE_SHOULD_BE_STRING = 'роль должна быть строкой';
const USER_ROLE_IS_NOT_CORRECT = 'роль должна быть одной из ';
const USER_UPDATE_ROLE_IS_NOT_CORRECT =
  'роль пользователя должна быть webmaster или curator';
const USER_OVER_USER_ID_SHOULD_BE_NUMBER = 'over user id должно быть числом';
const USER_OVER_USER_UPDATE_ROLE_IS_NOT_CORRECT =
  'роль over user должна быть curator или teamlead';
const USER_OVER_USER_UPDATE_ROLE_IDENTICAL =
  'роль пользователя (user) и менеджера (over user) не может быть одинаковой';
const USER_BAN_SHOULD_BE_BOOLEAN = 'бан должен быть true или false';

// Telegram Error
const TELEGRAM_NOT_CONFIRMED = 'телеграм не подтверждён';
const TELEGRAM_CHAT_NOT_FOUND = 'телелеграм чат не найден';
const TELEGRAM_BOT_BLOCKED = 'телелеграм бот заблокирован';

// Confirm code Error
const REQUEST_ID_NOT_FOUND = 'request id не найден';
const REQUEST_ID_SHOULD_BE_STRING = 'request id должен быть строкой';
const REQUEST_ID_SHOULD_BE_LENGTH = 'длина request id должна быть 4';
const CONFIRM_CODE_SHOULD_BE_STRING = 'код подтверждения должен быть строкой';
const CONFIRM_CODE_SHOULD_BE_LENGTH = 'длина кода подтверждения должна быть 4';
const CONFIRM_CODE_EXPIRED = 'код подтверждения просрочен';
const CONFIRM_CODE_NOT_CONFIRMED = 'код не подтвержден';

// Publication Error
const PUBLICATION_NOT_FOUND = 'публикация не найдена';
const PUBLICATION_TITLE_SHOULD_BE_STRING = 'название должно быть строкой';
const PUBLICATION_TITLE_SHOULD_BE_LENGTH =
  'длина названия должна быть от З до 100';
const PUBLICATION_CONTENT_SHOULD_BE_STRING = 'контент должен быть строкой';
const PUBLICATION_PREVIEW_SHOULD_BE_STRING =
  'ссылка на превью должна быть строкой';
const PUBLICATION_IS_NEWS_SHOULD_BE_BOOLEAN =
  'флаг is_news должен быть true или false';
const PUBLICATION_IS_HIDDEN_SHOULD_BE_BOOLEAN =
  'флаг is_hidden должен быть true или false';
const PUBLICATION_CATEGORY_NOT_FOUND = 'категория не найдена';
const PUBLICATION_CATEGORY_ID_SHOULD_BE_NUMBER =
  'category_id должено быть числом';
const PUBLICATION_CATEGORY_SHOULD_BE_STRING = 'категория должна быть строкой';
const PUBLICATION_CATEGORY_SHOULD_BE_LENGTH =
  'длина категории должна быть от 2 до 50';
const PUBLICATION_CATEGORY_ALREADY_EXISTS = 'категория уже существует';
const PUBLICATION_AUTHOR_SHOULD_BE_STRING = 'автор должна быть строкой';

export {
  ACCESS_DENIED,
  UNAUTHORIZED,
  SERVER_ERROR,
  CANNOT_ROUTE,
  QUERY_LIMIT_SHOULD_BE_NUMBER,
  QUERY_LIMIT_MIN,
  QUERY_LIMIT_MAX,
  QUERY_OFFSET_SHOULD_BE_NUMBER,
  QUERY_OFFSET_MIN,
  QUERY_SEARCH_SHOULD_BE,
  QUERY_SEARCH_SHOULD_BE_LENGTH,
  QUERY_IS_NEWS_SHOULD_BE_BOOLEAN,
  QUERY_IS_HIDDEN_SHOULD_BE_BOOLEAN,
  REFRESH_TOKEN_SHOULD_BE_STRING,
  USER_NOT_SAVED,
  USER_NOT_FOUND,
  USER_ADMIN_ALREADY_EXIST,
  USER_ADMIN_CANNOT_DELETE,
  USER_ID_SHOULD_BE_NUMBER,
  USER_LOGIN_EXISTS,
  USER_LOGIN_SHOULD_BE_STRING,
  USER_LOGIN_SHOULD_BE_LENGTH,
  USER_LOGIN_SHOULD_INCLUDE,
  USER_LOGIN_SHOULD_START,
  USER_OVER_USER_LOGIN_SHOULD_BE_STRING,
  USER_WRONG_LOGIN_PASSWORD,
  USER_PASSWORD_SHOULD_BE_STRING,
  USER_PASSWORD_SHOULD_BE_LENGTH,
  USER_TELEGRAM_EXISTS,
  USER_TELEGRAM_SHOULD_BE_STRING,
  USER_TELEGRAM_SHOULD_INCLUDE,
  USER_PHONE_EXISTS,
  USER_PHONE_SHOULD_BE_STRING,
  USER_PHONE_SHOULD_BE_LENGTH,
  USER_PHONE_SHOULD_INCLUDE,
  USER_ROLE_SHOULD_BE_STRING,
  USER_ROLE_IS_NOT_CORRECT,
  USER_UPDATE_ROLE_IS_NOT_CORRECT,
  USER_OVER_USER_ID_SHOULD_BE_NUMBER,
  USER_OVER_USER_UPDATE_ROLE_IS_NOT_CORRECT,
  USER_OVER_USER_UPDATE_ROLE_IDENTICAL,
  USER_BAN_SHOULD_BE_BOOLEAN,
  TELEGRAM_NOT_CONFIRMED,
  TELEGRAM_CHAT_NOT_FOUND,
  TELEGRAM_BOT_BLOCKED,
  REQUEST_ID_NOT_FOUND,
  REQUEST_ID_SHOULD_BE_STRING,
  REQUEST_ID_SHOULD_BE_LENGTH,
  CONFIRM_CODE_SHOULD_BE_STRING,
  CONFIRM_CODE_SHOULD_BE_LENGTH,
  CONFIRM_CODE_EXPIRED,
  CONFIRM_CODE_NOT_CONFIRMED,
  PUBLICATION_NOT_FOUND,
  PUBLICATION_TITLE_SHOULD_BE_STRING,
  PUBLICATION_TITLE_SHOULD_BE_LENGTH,
  PUBLICATION_CONTENT_SHOULD_BE_STRING,
  PUBLICATION_PREVIEW_SHOULD_BE_STRING,
  PUBLICATION_IS_NEWS_SHOULD_BE_BOOLEAN,
  PUBLICATION_IS_HIDDEN_SHOULD_BE_BOOLEAN,
  PUBLICATION_CATEGORY_NOT_FOUND,
  PUBLICATION_CATEGORY_ID_SHOULD_BE_NUMBER,
  PUBLICATION_CATEGORY_SHOULD_BE_STRING,
  PUBLICATION_CATEGORY_SHOULD_BE_LENGTH,
  PUBLICATION_CATEGORY_ALREADY_EXISTS,
  PUBLICATION_AUTHOR_SHOULD_BE_STRING,
};
