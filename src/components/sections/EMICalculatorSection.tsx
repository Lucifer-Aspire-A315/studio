import { EMICalculator } from '@/components/shared/EMICalculator';

export function EMICalculatorSection() {
  return (
    <section id="calculator" className="py-16 md:py-20 bg-secondary">
<<<<<<< HEAD
      <div className="container mx-auto px-6">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center border border-[#B2C8BA] transition-all duration-200 hover:shadow-2xl">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold" style={{ color: '#4E944F' }}>
              Plan Your Loan with our EMI Calculator
            </h2>
            <p className="mt-4 text-muted-foreground">
              Estimate your monthly payments to plan your finances better. Just enter the loan amount, interest rate, and tenure.
            </p>
=======
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Plan Your Loan with our EMI Calculator</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Estimate your monthly payments to plan your finances better. Just enter the loan amount, interest rate, and tenure.
        </p>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-card rounded-2xl shadow-xl p-8 border">
            <EMICalculator />
>>>>>>> 287e1e1 (ok remove the last update)
          </div>
        </div>
      </div>
    </section>
  );
}
