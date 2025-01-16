import os
import requests
import json
from dotenv import load_dotenv
from math import ceil

load_dotenv()

SEOUL_OPENDATA_KEY = os.getenv('VITE_SEOUL_OPENDATA_KEY')

def fetch_data(date, hour, start, end):
    url = f'http://openapi.seoul.go.kr:8088/{SEOUL_OPENDATA_KEY}/json/tbCycleRentUseTimeInfo/{start}/{end}/{date}/{hour}'
    response = requests.get(url)
    
    response.raise_for_status()
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data for range {start}-{end}, Status Code: {response.status_code}")
    
    return response.json()

def fetch_per_hour(hour: int, date: int, output_dir: str):
    print(f"Fetching initial data for {date}, {hour}h...")
    initial_data = fetch_data(date, hour, 1, 50)
    list_total_count = int(initial_data["cycleRentUseTimeInfo"]["list_total_count"])

    chunk_size = 1000
    ranges = [(i, min(i + chunk_size - 1, list_total_count)) for i in range(1, list_total_count + 1, chunk_size)]

    all_data = []

    for start, end in ranges:
        print(f"Fetching data for range {start}-{end}...")
        data = fetch_data(date, hour, start, end)
        all_data.extend(data["cycleRentUseTimeInfo"]["row"])

    # Save the fetched data in the created directory
    output_file = os.path.join(output_dir, f'usage_info_{date}_{hour}.json')

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=4)

    print(f"JSON file has been created successfully at {output_file}.\n")

def main():
    date = 20240416
    output_dir = f"usage_info_bytime_{date}"
    
    # Create the directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for hour in range(0, 24):
        fetch_per_hour(hour, date, output_dir)

if __name__ == "__main__":
    main()
