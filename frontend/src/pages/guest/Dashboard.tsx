import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import { useServiceOrders } from "@/hooks/useServices";
import { Link } from "react-router-dom";

export function Dashboard() {
  const bookings = useBookings(0);
  const orders = useServiceOrders({ page: 0, size: 1 });

  const bCount = bookings.data?.totalElements ?? 0;
  const oCount = orders.data?.totalElements ?? 0;

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Кабінет гостя</h1>
      <p className="mt-2 text-slate-custom">Швидкі дії та зведення.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Бронювання</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-gold">{bCount}</p>
            <Button variant="outline" asChild>
              <Link to="/guest/bookings">Перейти</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Мої послуги</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-gold">{oCount}</p>
            <Button variant="outline" asChild>
              <Link to="/guest/orders">Перейти</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button variant="gold" asChild>
          <Link to="/rooms">Каталог номерів</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/services">Послуги</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/guest/reviews/write">Залишити відгук</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/guest/profile">Профіль</Link>
        </Button>
      </div>
    </PageTransition>
  );
}
