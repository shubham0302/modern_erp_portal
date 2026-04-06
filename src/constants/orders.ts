/**
 * Time to wait before marking payment_confirmed order as expired (90 seconds)
 */
export const ORDER_NOTIFICATION_TIMER_MS = 90000;

/**
 * Grace period for showing notification after expiration (90 seconds + 60 seconds)
 */
export const ORDER_NOTIFICATION_GRACE_PERIOD_MS =
  ORDER_NOTIFICATION_TIMER_MS + 60000;
