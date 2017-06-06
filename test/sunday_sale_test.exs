defmodule SundaySaleTest do
  use ExUnit.Case
  doctest SundaySale

  test "builds proper urls" do
    resulting_urls = SundaySale.build_urls({:ok, "0604"})
    assert resulting_urls == ["http://longs.staradvertiser.com/oahu/0604/pdf/oahu0604.pdf",
                              "http://longs.staradvertiser.com/maui/0604/pdf/maui0604.pdf",
                              "http://longs.staradvertiser.com/kauai/0604/pdf/kauai0604.pdf",
                              "http://longs.staradvertiser.com/kona/0604/pdf/kona0604.pdf",
                              "http://longs.staradvertiser.com/hilo/0604/pdf/hilo0604.pdf"]

  end
end
