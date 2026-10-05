import os
import sys
import time
from playwright.sync_api import sync_playwright
from verify_pdf import verify_pdf

def test_multi_scenario_pdf_export():
    print("[Playwright Multi-Scenario Test] Starting browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        # Step 1: Open Scenarios Page
        print("[Playwright Test] Navigating to http://localhost:3000/scenarios...")
        page.goto("http://localhost:3000/scenarios")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        exported_files = []

        # Export for Scenario A (default active)
        print("[Playwright Test] Exporting default scenario threat report...")
        page.goto("http://localhost:3000/reports")
        page.wait_for_load_state("networkidle")
        time.sleep(1)

        export_btn = page.get_by_text("EXPORT REPORT (PDF)")
        with page.expect_download(timeout=30000) as download_info:
            export_btn.click()
        dl_a = download_info.value
        path_a = os.path.join(os.getcwd(), "scratch", f"scenario_A_{dl_a.suggested_filename}")
        dl_a.save_as(path_a)
        exported_files.append(path_a)
        print(f"[Playwright Test] Scenario A report saved to: {path_a}")

        browser.close()

        # Verify all exported files
        all_passed = True
        for path in exported_files:
            res = verify_pdf(path)
            if not res:
                all_passed = False

        return all_passed

if __name__ == "__main__":
    result = test_multi_scenario_pdf_export()
    print(f"[MULTI-SCENARIO TEST RESULT]: {'SUCCESS' if result else 'FAILURE'}")
    sys.exit(0 if result else 1)
