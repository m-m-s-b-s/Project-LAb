let countdownInterval; // So we don't create multiple intervals

function calculate() {
  const birthInput = document.getElementById("birthDate").value;
  if (!birthInput) {
    document.getElementById("ageResult").textContent = "Please enter your birth date.";
    document.getElementById("countdown").textContent = "";
    return;
  }

  const birthDate = new Date(birthInput);
  const now = new Date();

  // === Age Calculation ===
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  document.getElementById("ageResult").textContent =
    `You are ${years} years, ${months} months, and ${days} days old.`;

  // === Countdown to Next Birthday ===
  let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  // If birthday already passed this year
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  // Clear existing interval to avoid stacking
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = nextBirthday - now;

    if (diff <= 0) {
      document.getElementById("countdown").textContent = "🎉 Happy Birthday!";
      clearInterval(countdownInterval);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("countdown").textContent =
      `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs left!`;
  }, 1000);
}
