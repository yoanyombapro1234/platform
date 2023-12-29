class MixPanelEvents {
  // ACTION BASED EVENTS
  /*
    number of newly acquired user (or registered users) is the headline for total volume of traffic. 
    Although it is often a vanity metric, sometimes it can be useful at very early stages to gauge size.
    However, at later stages, number of active users (below) would be a better measure for the
    size of your network because it measures your effective user base
  */
  public REGISTRATION_ACTION_EVENT = "registration";
  // login event is a good indicator of the number of active users
  public LOGIN_ACTION_EVENT = "login";
  // financial dashboard check event is a good indicator of the number of user wh checked their financial dashboards
  public FINANCIAL_DASHBOARD_CHECK_ACTION_EVENT = "financial_dashboard_check";
  // analytics dashboard check event is a good indicator of the number of user wh checked their analytics dashboards
  public ANALYTICS_DASHBOARD_CHECK_ACTION_EVENT = "analytics_dashboard_check";
  // ASK_SOLOMON_AI_EVENT denotes a case where customers inquired about a specific piece of data that they are being provided with
  public ASK_SOLOMON_AI_ACTION_EVENT = "ask_solomon_ai";
  // NEW_ACCOUNT_LINK_EVENT denotes a case when a customer linked a new financial account on the solomone ai platform
  public NEW_ACCOUNT_LINK_ACTION_EVENT = "new_account_linked";
  // REQUEST_PASSWORD_RESET_EVENT denotes a case when a customer requested a password reset
  public REQUEST_PASSWORD_RESET_EVENT = "reset_password_request";
  // RESET_PASSWORD_EVENT denotes a case when a customer reset their password
  public RESET_PASSWORD_EVENT = "reset_password";
  // CREATE_SMART_GOAL_EVENT denotes a case when a customer created a new smart goal
  public CREATE_SMART_GOAL_EVENT = "create_smart_goal";
  // LOGOUT_EVENT denotes a case when a customer logged out of their account
  public LOGOUT_EVENT = "logout";
  public DELETE_USER_EVENT = "delete_user";

  // FEATURE BASED EVENTS
  // FEATURE_VIEW_SUBSCRIPTIONS_EVENT denotes a case when a customer viewed their financial subscriptions
  public FEATURE_VIEW_SUBSCRIPTIONS_EVENT_PORTAL =
    "feature_view_subscriptions_portal";
  // FEATURE_VIEW_ACTIONABLE_INSIGHTS_EVENT denotes a case when a customer viewed their actionable insights
  public FEATURE_VIEW_ACTIONABLE_INSIGHTS_PORTAL_EVENT =
    "feature_view_actionable_insights_portal";
  // FEATURE_VIEW_FINANCIAL_DASHBOARD_EVENT denotes a case when a customer viewed their financial dashboard
  public FEATURE_VIEW_FINANCIAL_DASHBOARD_EVENT =
    "feature_view_financial_dashboard_portal";
  public FEATURE_VIEW_FINANCIAL_SUB_DASHBOARD_EVENT =
    "feature_view_financial_sub_dashboard_portal";
  public FEATURE_VIEW_TRANSACTION_PORTAL_EVENT =
    "feature_view_transactions_portal";
  public FEATURE_VIEW_INCOME_METRICS_PORTAL_EVENT =
    "feature_view_income_metrics_portal";
  public FEATURE_VIEW_FINANCIAL_HOME_PORTAL_EVENT =
    "feature_view_financials_home_portal";
  public FEATURE_VIEW_ANALYTICS_AND_INSIGHTS_PORTAL_EVENT =
    "feature_view_analytics_and_insights_portal";

  // post creation event is a good indicator of the number of active users
  public POST_CREATION_EVENT = "post_created";
  public COMMENT_CREATION_EVENT = "comment_created";
  public ARTICLE_CREATION_EVENT = "article_created";
  public COMMUNITY_CREATION_EVENT = "community_created";
  public COMMENT_ENGAGEMENT_EVENT = "comment_engagement";
  public POST_ENGAGEMENT_EVENT = "post_engagement";
  public COMMUNITY_ENGAGEMENT_EVENT = "community_engagement";
  public ARTICLE_ENGAGEMENT_EVENT = "article_engagement";
  public TOPIC_CREATION_EVENT = "topic_creation_event";

  public ACCOUNT_LINK_EVENT = "account_linked";
}

export const eventNames = new MixPanelEvents();
