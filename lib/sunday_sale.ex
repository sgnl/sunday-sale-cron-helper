defmodule SundaySale do
  alias Timex
  alias Mongo
  alias HTTPoison

  @islands ['oahu', 'maui', 'kauai', 'kona', 'hilo']

  @moduledoc """
  Documentation for SundaySale.
  """

  @doc """
  Hello world.
  """
  def main do
    get_date()
    |> build_urls
    |> insert_into_database
  end

  def get_date do
    timestamp = Timex.shift(Timex.now, days: 1)
    |> Timex.format("%m%d", :strftime)

    case timestamp do
      {:ok, date} -> %SundaySale.Brochure{date: date}
      _ -> IO.puts "Bad Timex/timestamp"
    end
  end

  def build_urls(%SundaySale.Brochure{date: date} = brochure) do
    Enum.map(@islands, fn(island) ->
      url = url_template(island, date)
      %SundaySale.Brochure{brochure | url: url, island: island}
    end)
  end

  def url_template(island, date) do
    "http://longs.staradvertiser.com/#{island}/#{date}/pdf/#{island}#{date}.pdf"
  end

  def insert_into_database(brochures) do
    {:ok, _} = Mongo.start_link(
      name: :mongo,
      hostname: System.get_env("MONGO_URL"),
      database: System.get_env("MONGO_DB_NAME"),
      port: 23370,
      username: System.get_env("MONGO_USER"),
      password: System.get_env("MONGO_PW")
    )

    :mongo
    |> Mongo.find("brochures", %{}, sort: [created_at: -1], limit: 5)
    |> Enum.to_list
  end
end
