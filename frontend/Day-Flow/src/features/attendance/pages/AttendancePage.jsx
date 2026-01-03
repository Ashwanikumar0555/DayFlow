import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
// Assuming we might want badge styles, or just use div classes
import { Clock, Calendar as CalendarIcon, MapPin, UserCheck, UserX } from 'lucide-react';

const EmployeeAttendance = () => {
    const [status, setStatus] = useState('out'); // 'in' or 'out'
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Mock Office Coordinates (Example: New Delhi) - Replace with actual office coords
    const OFFICE_LAT = 28.6139;
    const OFFICE_LNG = 77.2090;
    const ALLOWED_RADIUS_KM = 0.5; // 500 meters

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const handleCheckIn = () => {
        setLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // For now, we are just logging it. 
                // To enable strict Geofencing, uncomment the logic below:

                /*
                const distance = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
                if (distance > ALLOWED_RADIUS_KM) {
                    setLocationError(`You are too far from the office (${distance.toFixed(2)}km away).`);
                    setLoadingLocation(false);
                    return;
                }
                */

                // Assuming success for demo purposes or if distance check passes
                setStatus('in');
                setLoadingLocation(false);
                console.log(`Checked in at: ${latitude}, ${longitude}`);
            },
            (error) => {
                setLocationError("Unable to retrieve your location. Please allow location access.");
                setLoadingLocation(false);
            }
        );
    };

    const handleCheckOut = () => {
        setStatus('out');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Attendance</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Today's Status</CardTitle>
                        <CardDescription>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">

                        {/* Attendance Percentage Display - Replacing Clock */}
                        <div className={`h-40 w-40 rounded-full flex items-center justify-center border-4 ${status === 'in' ? 'border-green-500 bg-green-500/10' : 'border-slate-300 bg-slate-100 dark:bg-slate-800'} transition-all duration-500`}>
                            <div className="text-center">
                                <Clock className={`h-10 w-10 mx-auto mb-2 ${status === 'in' ? 'text-green-600' : 'text-slate-400'}`} />
                                <span className={`text-xl font-bold ${status === 'in' ? 'text-green-700' : 'text-slate-500'}`}>
                                    {status === 'in' ? 'Checked In' : 'Checked Out'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <Button
                                size="lg"
                                className={`flex-1 ${status === 'out' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 pointer-events-none'}`}
                                onClick={handleCheckIn}
                                disabled={status === 'in'}
                            >
                                Check In
                            </Button>
                            <Button
                                size="lg"
                                variant="destructive"
                                className="flex-1"
                                onClick={handleCheckOut}
                                disabled={status === 'out' || (todayRecord && todayRecord.clockOut)}
                            >
                                Check Out
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>Location: {todayRecord?.location || 'Not Detected'}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Recent History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {history.length === 0 ? <div className="text-sm text-muted-foreground">No records found.</div> :
                                    history.slice(0, 5).map((log, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 transition-colors">
                                            <span className="font-medium text-muted-foreground w-20">{new Date(log.date).toLocaleDateString()}</span>
                                            <div className="flex-1 text-center">
                                                {log.clockIn ? new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'} -
                                                {log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ' Active'}
                                            </div>
                                            <span className={`font-medium text-xs ml-4 ${log.status === 'Present' ? 'text-green-600' : 'text-orange-500'}`}>{log.status}</span>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminAttendance = () => {
    const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, onLeave: 0 });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats
                const statsRes = await api.get('/attendance/stats');
                if (statsRes.data.success) {
                    setStats(statsRes.data.data.stats || { present: 0, late: 0, absent: 0, onLeave: 0 }); // Fallback if structure varies
                }

                // Fetch logs
                const logsRes = await api.get('/attendance/all?limit=10'); // Limit for demo
                if (logsRes.data.success) {
                    setLogs(logsRes.data.data.attendance);
                }
            } catch (error) {
                console.error("Failed to fetch admin attendance:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading records...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
                    <p className="text-muted-foreground">Monitor daily employee attendance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Date:</span>
                    <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Today
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Present</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.present || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Late Arrival</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-500">{stats.late || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">{stats.absent || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-500">{stats.onLeave || 0}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Employee</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Check In</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Check Out</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr><td colSpan="5" className="p-4 text-center">No attendance records today.</td></tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id} className="border-b">
                                            <td className="p-4 font-medium">
                                                {log.employee?.firstName} {log.employee?.lastName}
                                                <span className="text-xs text-muted-foreground block">{log.employee?.user?.employeeId}</span>
                                            </td>
                                            <td className="p-4">{log.clockIn ? new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</td>
                                            <td className="p-4">{log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</td>
                                            <td className="p-4">{new Date(log.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${log.status === 'Present' ? 'bg-green-500/10 text-green-500' :
                                                    log.status === 'Absent' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-orange-500/10 text-orange-500'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const AttendancePage = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return ['admin', 'hr'].includes(user.role?.toLowerCase()) ? <AdminAttendance /> : <EmployeeAttendance />;
};

export default AttendancePage;
