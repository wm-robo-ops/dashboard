package Dashboard;

import java.io.IOException;

import javax.swing.JFrame;
import Dashboard.VideoStreamPlayer;

public class Main {

    private JFrame frame = new JFrame();
    
    public Main() {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);

        VideoStreamPlayer vsp = new VideoStreamPlayer();
        String[] arg = {"/Users/kelvinabrokwa/hacku/astute-dev.github.io/video/stock.mp4"};
        try {
            vsp.init(arg);
        }
        catch (InterruptedException e) { e.printStackTrace();}
        catch (IOException e) { e.printStackTrace(); }
    }
    
    
    public static void main(String[]  args) {
        Main m = new Main();
    }

}
