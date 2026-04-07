export class DataRetentionService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async cleanupExpiredData() {
    const results = {
      auditLogsDeleted: 0,
      sessionsAnonymized: 0,
      errors: []
    };

    try {
      results.auditLogsDeleted = await this.cleanupOldAuditLogs();
    } catch (e) {
      results.errors.push(`Failed to cleanup audit logs: ${e.message}`);
    }

    try {
      results.sessionsAnonymized = await this.anonymizeOldSessions();
    } catch (e) {
      results.errors.push(`Failed to anonymize sessions: ${e.message}`);
    }

    return results;
  }

  async cleanupOldAuditLogs() {
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);

    const { data, error } = await this.supabase
      .from('data_processing_logs')
      .delete()
      .lt('created_at', sevenYearsAgo.toISOString())
      .select('id');

    if (error) {
      console.error('Error cleaning up audit logs:', error);
      throw error;
    }

    return data?.length || 0;
  }

  async anonymizeOldSessions() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data, error } = await this.supabase
      .from('data_processing_logs')
      .update({ 
        ip_address: null,
        user_agent: null
      })
      .lt('created_at', oneYearAgo.toISOString())
      .is('user_id', null)
      .select('id');

    if (error) {
      console.error('Error anonymizing sessions:', error);
      throw error;
    }

    return data?.length || 0;
  }

  async anonymizeUserData(userId) {
    const anonymousId = `anonymous_${Date.now()}`;

    const { error: profileError } = await this.supabase
      .from('profile')
      .update({
        name: 'Deleted User',
        bio: null,
        image: null,
        github: null,
        country: null,
        skills: null,
        interests: null
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error anonymizing profile:', profileError);
      throw profileError;
    }

    const { error: projectError } = await this.supabase
      .from('projects')
      .update({
        email: null,
        linkedin: null,
        twitter: null,
        website: null,
        portfolio: null,
        bank_acct: null,
        wallet_address: null
      })
      .eq('user_id', userId);

    if (projectError) {
      console.error('Error anonymizing projects:', projectError);
      throw projectError;
    }

    return true;
  }

  async getDataProcessingRecords(userId, limit = 100) {
    let query = this.supabase
      .from('data_processing_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching processing records:', error);
      throw error;
    }

    return data;
  }

  async logDataProcessing(userId, action, entityType = null, entityId = null, details = null) {
    const { data, error } = await this.supabase
      .from('data_processing_logs')
      .insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging data processing:', error);
      throw error;
    }

    return data;
  }

  async getPrivacyRequests(userId = null, status = null) {
    let query = this.supabase
      .from('privacy_requests')
      .select('*')
      .order('requested_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching privacy requests:', error);
      throw error;
    }

    return data;
  }

  async createPrivacyRequest(userId, requestType, details = null) {
    const { data, error } = await this.supabase
      .from('privacy_requests')
      .insert({
        user_id: userId,
        request_type: requestType,
        status: 'pending',
        details
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating privacy request:', error);
      throw error;
    }

    return data;
  }

  async updatePrivacyRequest(requestId, status, completedAt = null) {
    const { data, error } = await this.supabase
      .from('privacy_requests')
      .update({
        status,
        completed_at: completedAt || new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating privacy request:', error);
      throw error;
    }

    return data;
  }
}
