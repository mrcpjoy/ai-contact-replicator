import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const offices = [
  {
    name: "Quinton",
    address: "817 Hagley Road West, Quinton, Birmingham B32 1AD",
  },
  {
    name: "Stourbridge",
    address: "The Old Court House, 7-9 Hagley Road, Stourbridge DY8 1QL",
  },
  {
    name: "Wellingborough",
    address: "32A Sheep Street, Wellingborough, Northamptonshire NN8 1BS",
  },
  {
    name: "Market Harborough",
    address: "19 The Point Business Park, Rockingham Road, Market Harborough LE16 7QU",
  },
  {
    name: "Tamworth",
    address: "43 Albert Road, Tamworth Staffordshire B79 7JS",
  },
  {
    name: "Lichfield",
    address: "Brooke House, 24 Dam Street, Lichfield Staffordshire WS13 6AA",
  },
  {
    name: "Great Barr",
    address: "498 Queslett Road, Great Barr, Birmingham B43 7EU",
  },
  {
    name: "Kings Heath",
    address: "132-134 Alcester Road South, Kings Heath, Birmingham B14 7JG",
  },
];

const OfficeLocations = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Find your nearest office
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offices.map((office) => (
            <Card key={office.name} className="hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{office.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {office.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfficeLocations;
