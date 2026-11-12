import { useEffect, useRef, useState } from "react";

type ScreenId = "offline" | "bookings" | "details";
type TabId = "upcoming" | "completed" | "cancelled" | "all";
type Anim = "idle" | "in" | "out";

const TICKET = {
  uts: "X00OEHT1B4",
  type: "MONTHLY",
  bookedLabel: "Fri, 6 Nov 26",
  from: "KALYAN JN.",
  to: "DADAR",
  km: "45 km",
  mobile: "7039365196",
  name: "Sappanimuthu Yadav",
  when: "06 Nov 2026, 08:57",
  train: "R18061",
  bookedOn: "06/11/2026 08:57",
  trainType: "ORDINARY",
  klass: "SECOND",
  fare: "215.00",
  validFrom: "07/11/2026",
  validUpto: "06/12/2026",
  via: "1RT>>DIVA-TNA-CLA-DR",
  age: "18 years",
  idType: "Govt. issued Icard",
  idNo: "538527610345",
};

const PREVIEW_SECONDS = 4;

export function UtsApp() {
  const [top, setTop] = useState<ScreenId>("offline");
  const [under, setUnder] = useState<ScreenId | null>(null);
  const [anim, setAnim] = useState<Anim>("idle");
  const [tab, setTab] = useState<TabId>("upcoming");
  const lock = useRef(false);
  const timer = useRef<number | null>(null);

  function finishLater(ms: number, fn: () => void) {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      lock.current = false;
      timer.current = null;
      fn();
    }, ms);
  }

  function push(next: ScreenId) {
    if (lock.current) return;
    lock.current = true;
    setUnder(top);
    setTop(next);
    setAnim("in");
    finishLater(270, () => {
      setUnder(null);
      setAnim("idle");
    });
  }

  function pop() {
    if (lock.current) return;
    const dest: ScreenId = top === "details" ? "bookings" : "offline";
    if (top === dest) return;
    lock.current = true;
    setUnder(dest);
    setAnim("out");
    finishLater(250, () => {
      setTop(dest);
      setUnder(null);
      setAnim("idle");
    });
  }

  const topClass = anim === "in" ? "screen screen-in" : anim === "out" ? "screen screen-out" : "screen";

  return (
    <div className="stage">
      <div className="phone">
        {under && (
          <div className="screen" style={{ pointerEvents: "none" }}>
            {under === "offline" && <OfflineScreen onBookings={() => {}} />}
            {under === "bookings" && (
              <BookingsScreen
                tab={tab}
                onTab={setTab}
                onBack={() => {}}
                onView={() => {}}
              />
            )}
          </div>
        )}
        <div className={topClass} key={top}>
          {top === "offline" && <OfflineScreen onBookings={() => push("bookings")} />}
          {top === "bookings" && (
            <BookingsScreen
              tab={tab}
              onTab={setTab}
              onBack={pop}
              onView={() => push("details")}
            />
          )}
          {top === "details" && <DetailsScreen onBack={pop} onExpire={pop} />}
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5.5 8.2 12 15 18.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.2 11.2 12 15l3.8-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 18.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7.5h14M5 12h14M5 16.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function WifiOff() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 28c6.2-6.4 14-9.6 20-9.6 6 0 13.8 3.2 20 9.6" stroke="#f15b55" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M18.5 35.2c4.4-4.4 9.2-6.6 13.5-6.6 4.3 0 9.1 2.2 13.5 6.6" stroke="#f15b55" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M25.2 42.2c2.2-2.1 4.6-3.2 6.8-3.2 2.2 0 4.6 1.1 6.8 3.2" stroke="#f15b55" strokeWidth="4.2" strokeLinecap="round" />
      <circle cx="32" cy="49.2" r="2.6" fill="#f15b55" />
      <path d="M16 16.5 48 48" stroke="#f15b55" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}

function TicketGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.2h16a1 1 0 0 1 1 1v2.1a1.7 1.7 0 0 0 0 3.2v2.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.2a1.7 1.7 0 0 0 0-3.2V9.2a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M12 8.6v8.6" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.5 1.8" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19.2 12a7.2 7.2 0 1 1-2.1-5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.4 4.8v4.2h-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabIcon({ kind }: { kind: TabId }) {
  if (kind === "upcoming") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 9.2h20a1.6 1.6 0 0 1 1.6 1.6v3.1a2.3 2.3 0 0 0 0 4.2v3.1A1.6 1.6 0 0 1 26 22.8H6a1.6 1.6 0 0 1-1.6-1.6v-3.1a2.3 2.3 0 0 0 0-4.2v-3.1A1.6 1.6 0 0 1 6 9.2z"
        />
        <path d="M16 10.4v11" stroke="#fff" strokeWidth="1.4" strokeDasharray="1.6 1.8" />
      </svg>
    );
  }
  if (kind === "cancelled") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M6.5 10h19a1.4 1.4 0 0 1 1.4 1.4v2.6a2 2 0 0 0 0 3.6v2.6A1.4 1.4 0 0 1 25.5 21.6h-19A1.4 1.4 0 0 1 5.1 20.2v-2.6a2 2 0 0 0 0-3.6v-2.6A1.4 1.4 0 0 1 6.5 10z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M13.2 13.4 18.8 19M18.8 13.4l-5.6 5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "all") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 8.5h15.2a1.2 1.2 0 0 1 1.2 1.2v1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M5.6 12.2h17.6a1.3 1.3 0 0 1 1.3 1.3v2.2a1.8 1.8 0 0 0 0 3.2v2.2a1.3 1.3 0 0 1-1.3 1.3H5.6a1.3 1.3 0 0 1-1.3-1.3v-2.2a1.8 1.8 0 0 0 0-3.2v-2.2a1.3 1.3 0 0 1 1.3-1.3z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M6.2 10.2h19.6a1.4 1.4 0 0 1 1.4 1.4v2.7a2.1 2.1 0 0 0 0 3.6v2.5a1.4 1.4 0 0 1-1.4 1.4H6.2a1.4 1.4 0 0 1-1.4-1.4v-2.5a2.1 2.1 0 0 0 0-3.6v-2.7a1.4 1.4 0 0 1 1.4-1.4z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M16 11.4v9.4" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.5 1.7" />
    </svg>
  );
}

function OfflineScreen({ onBookings }: { onBookings: () => void }) {
  const [shake, setShake] = useState(false);

  function tryAgain() {
    setShake(false);
    window.requestAnimationFrame(() => setShake(true));
  }

  return (
    <div className="offline">
      <div className={shake ? "wifi-tile shake" : "wifi-tile"} onAnimationEnd={() => setShake(false)}>
        <WifiOff />
      </div>
      <h1>No internet connection</h1>
      <p className="sub">
        Please check your internet connection
        <br />
        and try again
      </p>
      <div className="offline-actions">
        <button type="button" className="btn-fill" onClick={tryAgain}>
          Try Again!
        </button>
        <button type="button" className="btn-ghost" onClick={onBookings}>
          <TicketGlyph />
          My Bookings
        </button>
      </div>
    </div>
  );
}

const TABS: { id: TabId; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

function BookingsScreen({
  tab,
  onTab,
  onBack,
  onView,
}: {
  tab: TabId;
  onTab: (tab: TabId) => void;
  onBack: () => void;
  onView: () => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const showTicket = tab === "upcoming" || tab === "all";
  const heading =
    tab === "upcoming"
      ? "Upcoming (1)"
      : tab === "completed"
        ? "Completed (0)"
        : tab === "cancelled"
          ? "Cancelled (0)"
          : "All (1)";

  return (
    <>
      <header className="bar">
        <button type="button" className="circle-btn" aria-label="Back" onClick={onBack}>
          <Chevron />
        </button>
        <div className="bar-text">
          <div className="bar-title">My Bookings</div>
        </div>
        <button type="button" className="plain-btn spacer" aria-label="Download">
          <DownloadIcon />
        </button>
      </header>
      <div className="bookings-body">
        <div className="section-head">
          <span />
          <h2>{heading}</h2>
          <button
            type="button"
            className="icon-spin"
            aria-label="Refresh"
            onClick={() => {
              setSpinning(false);
              window.requestAnimationFrame(() => setSpinning(true));
            }}
          >
            <span className={spinning ? "spin" : undefined} onAnimationEnd={() => setSpinning(false)}>
              <RefreshIcon />
            </span>
          </button>
        </div>
        {showTicket ? (
          <article className="ticket">
            <div className="ticket-top">
              <div className="ticket-row">
                <span className="badge">Unreserved</span>
                <span className="uts-no">UTS: {TICKET.uts}</span>
              </div>
              <div className="meta">
                <div>
                  <div className="k">Ticket Type</div>
                  <div className="v">{TICKET.type}</div>
                </div>
                <div className="right">
                  <div className="k">Booking Date</div>
                  <div className="v">{TICKET.bookedLabel}</div>
                </div>
              </div>
              <div className="route">
                <div className="station">{TICKET.from}</div>
                <div className="km">— {TICKET.km} —</div>
                <div className="station end">{TICKET.to}</div>
              </div>
            </div>
            <div className="ticket-rip">
              <i className="bite left" />
              <i className="dash" />
              <i className="bite right" />
            </div>
            <div className="ticket-bot">
              <button type="button" className="linkish">
                Book Again
              </button>
              <span className="vbar" />
              <button type="button" className="linkish blue" onClick={onView}>
                View Details
              </button>
            </div>
          </article>
        ) : (
          <p className="empty">No bookings found</p>
        )}
      </div>
      <nav className="tabbar" aria-label="Booking filters">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "tab active" : "tab"}
            onClick={() => onTab(item.id)}
          >
            <TabIcon kind={item.id} />
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}

function formatClock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DetailsScreen({ onBack, onExpire }: { onBack: () => void; onExpire: () => void }) {
  const [left, setLeft] = useState(PREVIEW_SECONDS);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const endsAt = Date.now() + PREVIEW_SECONDS * 1000;
    let done = false;
    const id = window.setInterval(() => {
      const remain = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setLeft(remain);
      if (remain <= 0 && !done) {
        done = true;
        window.clearInterval(id);
        window.setTimeout(() => onExpireRef.current(), 650);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <header className="bar tall">
        <button type="button" className="circle-btn" aria-label="Back" onClick={onBack}>
          <Chevron />
        </button>
        <div className="bar-text">
          <div className="bar-title">Booking Details</div>
          <div className="bar-sub">Mobile: {TICKET.mobile}</div>
        </div>
        <button type="button" className="plain-btn spacer" aria-label="Menu">
          <MenuIcon />
        </button>
      </header>
      <div className="details-scroll">
        <p className="thanks">Thank You {TICKET.name}, Happy Journey !</p>
        <section className="banner" aria-label="Dynamic preview">
          <div className="rail en">
            <span>INDIAN RAILWAYS</span>
          </div>
          <div className="banner-core">
            <i className="vdash left" />
            <i className="vdash right" />
            <p className="banner-kicker">Dynamic preview will close in</p>
            <p className="timer" aria-label={`Preview closes in ${formatClock(left)}`}>
              {formatClock(left)}
            </p>
            <p className="banner-label">Ticket Booking Date & Time</p>
            <p className="banner-when">{TICKET.when}</p>
            <p className="banner-train">{TICKET.train}</p>
            <p className="banner-foot">Ticket is Non-Transferable</p>
          </div>
          <div className="rail hi">
            <span>भारतीय रेल</span>
          </div>
        </section>

        <div className="sheet">
          <div className="season">
            <div>
              <div className="k">Season Ticket</div>
              <div className="v">{TICKET.uts}</div>
            </div>
            <span className="active-pill">
              <i />
              ACTIVE
            </span>
          </div>

          <Pair k1="Source" v1={TICKET.from} k2="Destination" v2={TICKET.to} />
          <Pair k1="Distance" v1={TICKET.km} k2="Booked on" v2={TICKET.bookedOn} />
          <Pair k1="Ticket Type" v1={TICKET.type} k2="Train Types" v2={TICKET.trainType} />
          <Pair k1="Class" v1={TICKET.klass} k2="Fare" v2={TICKET.fare} />
          <Pair k1="Valid From" v1={TICKET.validFrom} k2="Valid Upto" v2={TICKET.validUpto} />

          <div className="via">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 7h9l-2.2-2.2M17 17H8l2.2 2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Via: {TICKET.via}
          </div>

          <Pair k1="Name" v1={TICKET.name} k2="Age" v2={TICKET.age} />
          <Pair k1="ID Type*" v1={TICKET.idType} k2="ID Number" v2={TICKET.idNo} />

          <p className="note">
            Note: This ticket is non refundable. Ticket is stored locally on the device. Please do not change your handset or perform factory reset.
          </p>

          <button type="button" className="upgrade">
            Upgrade to Superfast
          </button>

          <div className="qr-wrap">
            <img src="/ticket-qr.png" alt="Ticket QR code" />
          </div>

          <section className="know">
            <h3>Do you know?</h3>
            <p>IR recovers only 57% of cost of travel on an average.</p>
            <p>
              This ticket is booked on a personal user ID. It's sale/purchase is an offence u/s 143 of the Railways Act, 1989
            </p>
            <p>For enquiry and integrated railway helpline, please dial 139.</p>
          </section>
        </div>
      </div>
    </>
  );
}

function Pair({ k1, v1, k2, v2 }: { k1: string; v1: string; k2: string; v2: string }) {
  return (
    <div className="pair">
      <div>
        <div className="k">{k1}</div>
        <div className="v">{v1}</div>
      </div>
      <div className="right">
        <div className="k">{k2}</div>
        <div className="v">{v2}</div>
      </div>
    </div>
  );
}
