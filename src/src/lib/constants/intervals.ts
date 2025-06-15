/**
 * APIリクエストの自動更新間隔（ミリ秒）
 */
export const API_REFRESH_INTERVALS = {
  /** バナー通知の更新間隔: 1分 */
  NOTIFICATION_BANNER: 60 * 1000,
  
  /** 通知一覧の更新間隔: 5分 */
  NOTIFICATION_LIST: 5 * 60 * 1000,
  
  /** タブバッジの未読数更新間隔: 5分 */
  UNREAD_COUNT: 5 * 60 * 1000,
  
  /** 発行中クーポン一覧の更新間隔: 5分 */
  ACTIVE_ISSUES: 5 * 60 * 1000,
} as const 