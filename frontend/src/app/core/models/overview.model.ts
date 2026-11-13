export interface OverviewToday {
  booked: number;
  checkIns: number;
  checkOuts: number;
}

export interface RecentBooking {
  id: string;
  guestName: string;
  propertyName: string;
  start: string;
  end: string;
}

export interface UpcomingCheckIn {
  imageUrl: string;
  guestName: string;
  propertyName: string;
  date: string;
}

export interface PropertyOverview {
  today: OverviewToday;
  recentBookings: RecentBooking[];
  upcomingCheckIns: UpcomingCheckIn[];
}
