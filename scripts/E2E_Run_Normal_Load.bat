@echo off
REM ============================================================
REM Run End-to-End Flow Test - Normal Load (300 Users, 15 min Ramp-Up)
REM ============================================================

cd /d "%~dp0\.."

jmeter -n ^
 -t "E:\Habashy\Automation\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\Projects\Spree\Performance testing\scenarios\06_End_To_End_Flow.jmx" ^
 -l "E:\Habashy\Automation\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\Projects\Spree\Performance testing\results\jtl\E2E_Run_Normal_Load.jtl" ^
 -Jusers=300 ^
 -Jrampup=900

echo ============================================================
echo End-to-End Test Finished!
echo Results JTL: "E:\Habashy\Automation\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\Projects\Spree\Performance testing\results\jtl\E2E_Run_Normal_Load.jtl"
echo ============================================================

pause
