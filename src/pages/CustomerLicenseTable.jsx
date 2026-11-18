import { TIER_LABELS } from '../lib/capabilities';
import { legacyColors as colors } from '../design/colors';

const STYLES = {
  table: {
    header: {
      background: colors.background.secondary,
      color: colors.text.muted,
      fontSize: "0.625rem",
      fontWeight: "600",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      padding: "1rem",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
    },
    cell: {
      padding: "1rem",
      borderBottom: "1px solid rgba(0,0,0,0.04)",
      color: colors.text.primary,
      fontSize: "0.875rem",
    },
  },
};

function formatCreated(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return 'N/A';
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Previous admin table/mobile layout, fed only by verified owner inventory.
export function CustomerLicenseTable({ customers }) {
  return <>
                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left" style={STYLES.table.header}>
                          Customer Name
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          Email
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          License Key
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          Tier
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer, index) => (
                        <tr
                          key={customer.license_key || index}
                          className="hover:bg-[rgba(245,158,11,0.02)] transition-colors"
                        >
                          <td style={STYLES.table.cell}>
                            {customer.customer_name || "Unnamed customer"}
                          </td>
                          <td style={STYLES.table.cell}>
                            <span className="font-mono text-xs break-all">
                              {customer.email || "N/A"}
                            </span>
                          </td>
                          <td style={STYLES.table.cell}>
                            <span className="font-mono text-xs text-signal-warning break-all">
                              {customer.license_key}
                            </span>
                          </td>
                          <td style={STYLES.table.cell}>
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded"
                              style={{
                                background: "rgba(16,185,129,0.1)",
                                color: colors.process.primary,
                                border: "1px solid rgba(16,185,129,0.2)",
                              }}
                            >
                              {TIER_LABELS[customer.tier] || customer.tier}
                            </span>
                          </td>
                          <td style={STYLES.table.cell}>
                            <span className="text-xs text-txt-muted">
                              {formatCreated(customer.created_at)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden p-4 space-y-4">
                  {customers.map((customer, index) => (
                    <div
                      key={customer.license_key || index}
                      className="p-4 rounded-lg"
                      style={{
                        background: colors.background.secondary,
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-bold text-txt-primary break-words min-w-0">
                          {customer.customer_name || "Unnamed customer"}
                        </h3>
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded"
                          style={{
                            background: "rgba(16,185,129,0.1)",
                            color: colors.process.primary,
                            border: "1px solid rgba(16,185,129,0.2)",
                          }}
                        >
                          {TIER_LABELS[customer.tier] || customer.tier}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs break-words">
                        <div>
                          <span className="text-txt-muted uppercase tracking-wider">
                            Email:
                          </span>
                          <span className="ml-2 font-mono text-txt-secondary break-all">
                            {customer.email || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-txt-muted uppercase tracking-wider">
                            License:
                          </span>
                          <span className="ml-2 font-mono text-signal-warning break-all">
                            {customer.license_key}
                          </span>
                        </div>
                        <div>
                          <span className="text-txt-muted uppercase tracking-wider">
                            Created:
                          </span>
                          <span className="ml-2 text-txt-muted">
                            {formatCreated(customer.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  </>;
}
