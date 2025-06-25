import { EMICalculator } from '@/components/shared/EMICalculator';

export function EMICalculatorSection() {
  return (
    <section id="calculator" className="py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Plan Your Loan with our EMI Calculator</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Estimate your monthly payments to plan your finances better. Just enter the loan amount, interest rate, and tenure.
        </p>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-card rounded-2xl shadow-xl p-8 border">
            <EMICalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
