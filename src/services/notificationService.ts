
export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  static async scheduleJournalingReminders() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    // Schedule reminders for journaling sessions
    const now = new Date();
    const sessions = [
      { hour: 7, minute: 0, title: 'Morning Intention', message: 'Start your day with mindful intention 🌅' },
      { hour: 13, minute: 0, title: 'Midday Check-In', message: 'How is your day progressing? ☀️' },
      { hour: 15, minute: 0, title: 'CBT Reframing', message: 'Time to reframe negative thoughts 🧠' },
      { hour: 20, minute: 0, title: 'Evening Reflection', message: 'Reflect on your day with compassion 🌆' },
      { hour: 21, minute: 0, title: 'Gratitude Practice', message: 'What are you grateful for today? 🙏' }
    ];

    sessions.forEach(session => {
      const sessionTime = new Date();
      sessionTime.setHours(session.hour, session.minute, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (sessionTime <= now) {
        sessionTime.setDate(sessionTime.getDate() + 1);
      }

      const timeUntilSession = sessionTime.getTime() - now.getTime();
      
      setTimeout(() => {
        this.showNotification(session.title, session.message);
        // Schedule for next day
        setInterval(() => {
          this.showNotification(session.title, session.message);
        }, 24 * 60 * 60 * 1000);
      }, timeUntilSession);
    });
  }

  static showNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: { url: '/' }
      });
    }
  }

  static async showGoalReminder(goals: any[]) {
    const incompleteGoals = goals.filter(goal => !goal.completed);
    if (incompleteGoals.length > 0) {
      const goalText = incompleteGoals.length === 1 
        ? incompleteGoals[0].text 
        : `${incompleteGoals.length} goals`;
      
      this.showNotification(
        'Goal Reminder',
        `Don't forget about your goal: ${goalText} 🎯`
      );
    }
  }
}
