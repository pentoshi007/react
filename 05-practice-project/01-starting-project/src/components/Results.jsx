import { calculateInvestmentResults } from '../util/investment';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function Results({ userInput }) {
    const safeInput = {
        initialInvestment: Number(userInput.initialInvestment) || 0,
        annualInvestment: Number(userInput.annualInvestment) || 0,
        expectedReturn: Number(userInput.expectedReturn) || 0,
        duration: Math.max(0, Math.floor(Number(userInput.duration) || 0)),
    };
    const results = calculateInvestmentResults(safeInput);
    return (
        <table id="result">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Investment Value</th>
                    <th>Interest (Year)</th>
                    <th>Total Interest </th>
                    <th>Invested Capital</th>
                </tr>

            </thead>
            <tbody>
                {
                    results.map((result, index) => {
                        const totalInterest = results
                            .slice(0, index + 1)
                            .reduce((sum, r) => sum + r.interest, 0);
                        const investedCapital =
                            safeInput.initialInvestment + safeInput.annualInvestment * result.year;
                        return (
                            <tr key={result.year}>
                                <td>{result.year}</td>
                                <td>{currencyFormatter.format(result.valueEndOfYear)}</td>
                                <td>{currencyFormatter.format(result.interest)}</td>
                                <td>{currencyFormatter.format(totalInterest)}</td>
                                <td>{currencyFormatter.format(investedCapital)}</td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}