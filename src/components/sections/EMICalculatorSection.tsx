
import { EMICalculator } from '@/components/shared/EMICalculator';

export function EMICalculatorSection() {
  return (
    <section id="calculator" className="py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center border">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-card-foreground">Plan Your Loan with our EMI Calculator</h2>
            <p className="mt-4 text-muted-foreground">
              Estimate your monthly payments to plan your finances better. Just enter the loan amount, interest rate, and tenure.
            </p>
          </div>
          <EMICalculator />
        </div>
      </div>
    </section>
  );
}
